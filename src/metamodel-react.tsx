/* /// <reference path="../typings/index.d.ts" /> */

import * as React from 'react';

import {
  IModelType,
  IModelTypeComposite,
  IModelTypeItem,
  IModelView,
  ValidationScope,
  ModelView,
  IValidationMessage,
  IClientProps,
  ClientProps
} from '@hn3000/metamodel';

export {
  IModelType,
  IModelTypeComposite,
  IModelTypeItem,
  IModelView,
  ValidationScope,
  ModelView,
  IValidationMessage,
  IClientProps,
  ClientProps
} from '@hn3000/metamodel';

import { Promise } from 'es6-promise';

export {
  IFormProps,
  IFormState,
  IPageProps,
  IPageState,
  IInputProps,
  IInputState,
  IWrappers,
  IWrapperComponentProps,
  IInputComponentProps,
  IInputComponentState,
  IComponentMatcher,
  IFormConfig,
  IFormContext,
  InputComponent
} from './interfaces';

import {
  IFormProps,
  IFormState,
  IPageProps,
  IPageState,
  IInputProps,
  IInputState,
  IWrappers,
  IInputComponentProps,
  IInputComponentState,
  IComponentMatcher,
  IFormConfig,
  IFormContext,
  InputComponent
} from './interfaces';

import * as fields from './default-field-types';

import {
  ListenerManager,
  clickHandler
} from './listenermanager';

import {
  JsonPointer
} from '@hn3000/metamodel';

export class MetaFormContext extends ClientProps implements IFormContext, IClientProps {
  constructor(config: IFormConfig, metamodel:IModelTypeComposite<any>, data:any={}) {
    super();
    this._config = config;
    this._metamodel = metamodel;
    this._viewmodel = new ModelView(metamodel, data);

    this.pageBack = clickHandler(this.updatePage, this, -1);
    this.pageNext = clickHandler(this.updatePage, this, +1);

    this._listeners = new ListenerManager<()=>void>();

    if (null != this._config.onFormInit) {
      var update = this._config.onFormInit(this);
      update.then((x) => {
        if (typeof x === 'function') {
          let updater = x as ((model:IModelView<any>) => IModelView<any>);
          this.updateModelTransactional(updater);
        } else if (null != x) {
          this._updateViewModel(this._viewmodel.withAddedData(x));
        }
      });
    }
  }

  pageNext:(event:UIEvent)=>void;
  pageBack:(event:UIEvent)=>void;

  pageNextAllowed():boolean {
    let vm = this._viewmodel;
    let hasNext = vm.currentPageIndex < vm.getPages().length;

    return hasNext && vm.isPageValid(null); 
  }
  pageBackAllowed():boolean {
    let vm = this._viewmodel;
    return vm.currentPageIndex > 0;
  }

  get config(): IFormConfig {
    return this._config;
  }
  get metamodel(): IModelTypeComposite<any> /*</any>*/ { 
    return this._metamodel;
  }
  get viewmodel(): IModelView<any> /*</any>*/ {
    return this._viewmodel;
  }
  get currentPage(): number {
    if (!this._config.usePageIndex) {
      return this._viewmodel.currentPageNo;
    }
    return this._viewmodel.currentPageIndex;
  }

  /* 
   * similar to redux: returns the unsubscribe function
   * listeners always called asynchronously: validation runs before
   * listeners are notfied
   */
  subscribe(listener:()=>any):()=>void {
    return this._listeners.subscribe(listener);
  }

  updateModel(field:string, value:any) {
    this.updateModelTransactional(model => model.withChangedField(field,value));
  }
  updateModelTransactional(updater:(model:IModelView<any>) => IModelView<any>) {
    let newModel = updater(this._viewmodel);
    this._updateViewModel(newModel);
    if (this._config.validateOnUpdate || newModel.validationScope() != ValidationScope.VISITED) {
      let validated = newModel.validateDefault();
      validated.then((x) => this._updateViewModel(x));
    }
  }

  _updateViewModel(viewmodel:IModelView<any>) {
    this._viewmodel = viewmodel;
    this._notifyAll();
  }

  _notifyAll() {
    this._listeners.forEach((x) => x());
  }

  updatePage(step:number) {
    let model = this._viewmodel;

    let nextModel:Promise<IModelView<any>>;
    
    if (step < 0) {
      nextModel = Promise.resolve(model);
    } else if (model.currentPageNo == model.getPages().length) {
      nextModel = model.validateFull();
    } else {
      nextModel = model.validatePage();
    }
    
    nextModel
      .then((validatedModel) => {
        if (step < 0 || validatedModel.isPageValid(null)) {
          
          var promise:Promise<IModelView<any>>;

          if (this._config.onPageTransition) {

            // replace model without notification 
            // so onPageTransition starts with this one
            this._viewmodel = validatedModel; 

            let moreValidation = this._config.onPageTransition(this, step);
            promise = moreValidation.then((messages) => {
              var result = validatedModel
              if (messages && messages.length) {
                result = validatedModel.withValidationMessages(messages);
              }
              return result;
            }, () => {
              return validatedModel.withValidationMessages([
                { path:"", msg:"internal error (page transition handler)", code:'transition-error', isError: true }
              ])
            });
          } else {
            promise = Promise.resolve(validatedModel);
          }

          return promise.then((serverValidatedModel) => {
            if (step < 0 || serverValidatedModel.isPageValid(null)) {
              return serverValidatedModel.changePage(step);
            }
            return serverValidatedModel;
          });
        }
        return validatedModel;
      })
      .then((x) => this._updateViewModel(x));

  }

  private _listeners:ListenerManager<()=>void>;
  private _config:IFormConfig;
  private _metamodel: IModelTypeComposite<any>;   //</any>
  private _viewmodel: IModelView<any>;            //</any>
}

type matchQFun = (field:IModelType<any>)=>number;

function objMatcher(template:any):matchQFun { //</any>
  var keys = Object.keys(template);
  var n = keys.length;

  return ((field:IModelType<any> /*</any>*/) => { 
    var result = 0;
    var fieldObj = field as any;
    for (var i = 0; i < n; i++) {
      let k = keys[i];
      if (fieldObj[k] == template[k]) {
        ++result;
      }
    }
    return result;
  });
}

function kindMatcher(kind:string):matchQFun {
  return (field:IModelType<any>) => (field.kind === kind?1:0)
}

function andMatcher(...matcher:matchQFun[]):matchQFun {
  return (field:IModelType<any>) => matcher.reduce((q, m) => {
    let qq = m(field);
    return qq && q + qq;
  }, 0);
}

function hasPVC(from:number, to?:number) {
  return (field:IModelType<any>) => {
    let pv = field.asItemType() && field.asItemType().possibleValues();
    let pvc = pv ? pv.length : 0;
    if ((pvc >= from) && (!to || pvc < to)) {
      return 1;
    }
    return 0;
  }
}

export class MetaFormConfig implements IFormConfig {

  constructor(wrappers?:IWrappers, components?:IComponentMatcher[]) {
    this._wrappers = wrappers || MetaFormConfig.defaultWrappers();
    this._components = components || MetaFormConfig.defaultComponents();
  }

  setWrappers(wrappers:IWrappers) {
    this._wrappers = wrappers;
  }

  public get wrappers():IWrappers {
    return this._wrappers;
  }

  public get matchers(): IComponentMatcher[] {
    return this._components;
  }

  findBest(type: IModelType<any>, fieldName:string, flavor:string, ...matchargs: any[]): InputComponent {
    var bestQ = 0;
    var match:InputComponent = fields.MetaFormUnknownFieldType;

    let matchers = this._components;
    for (var i = 0, n = matchers.length; i<n; ++i) {
      let thisQ = matchers[i].matchQuality(type, fieldName, flavor, ...matchargs);
      if (thisQ > bestQ) {
        match = matchers[i].component;
        bestQ = thisQ;
      }
    }

    return match;
  }

  add(cm:IComponentMatcher) {
    if (-1 == this._components.indexOf(cm)) {
      this._components.push(cm);
    }
  }
  remove(cm:IComponentMatcher) {
    this._components = this._components.filter((x) => x != cm);
  }

  public usePageIndex = false;
  public validateOnUpdate: boolean = false;

  public onFormInit:(form:IFormContext)=>Promise<any> = null; // </any>
  public onPageTransition:(form:IFormContext, direction:number)=>Promise<IValidationMessage[]> = null; // </IValidationMessage>

  private _wrappers:IWrappers;
  private _components: IComponentMatcher[];

  public static defaultWrappers():IWrappers {
    return {
      form: fields.FormWrapper,
      page: fields.PageWrapper,
      field: fields.FieldWrapper,
    }
  }

  public static defaultComponents() {
    return [
      {
        matchQuality: kindMatcher('string'),
        component: fields.MetaFormInputString
      },
      {
        matchQuality: kindMatcher('number'),
        component: fields.MetaFormInputNumber
      },
      {
        matchQuality: kindMatcher('bool'),
        component: fields.MetaFormInputBool
      },
      {
        matchQuality: objMatcher({kind:'bool'}),
        component: fields.MetaFormInputBool
      },
      {
        matchQuality: andMatcher(kindMatcher('string'), hasPVC(10)),
        component: fields.MetaFormInputEnumSelect
      },
      {
        matchQuality: andMatcher(kindMatcher('string'), hasPVC(2,10)),
        component: fields.MetaFormInputEnumRadios
      },
      {
        matchQuality: andMatcher(kindMatcher('string'), hasPVC(1,2)),
        component: fields.MetaFormInputEnumCheckbox
      }
    ];
  }

}

export interface IMetaFormBaseProps {
  context?: IFormContext;
}
export interface IMetaFormBaseState {
  currentPage?:number;
}

export var MetaForm_ContextTypes = {
  formContext: React.PropTypes.shape({
    config: React.PropTypes.object,
    metamodel: React.PropTypes.object,
    viewmodel: React.PropTypes.object,
    currentPage: React.PropTypes.number,
    i18nData: React.PropTypes.object
  })
};

export abstract class MetaComponentBase<
      P extends IMetaFormBaseProps, 
      S extends IMetaFormBaseState
    > 
    extends React.Component<P, S> 
{

  static contextTypes = MetaForm_ContextTypes;

  constructor(props:P, context?:MetaFormContext) {
    super(props, context);
    this._unsubscribe = null;
  }

  get formContext():IFormContext {
    return this.props.context || (this.context as any).formContext;
  } 

  protected _updatedState(context?:IFormContext, initState?:boolean) {
    let newState:S = { 
      currentPage: context.currentPage 
    } as any;
    if (initState) {
      this.state = newState;
    } else {
      this.setState(newState);
    }
  }

  componentDidMount() {
    this._unsubscribe && this._unsubscribe();
    this._unsubscribe = this.formContext.subscribe(() => {
      if (!this._unsubscribe) return;
      this._updatedState(this.formContext);
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this._unsubscribe && this._unsubscribe();
    this._unsubscribe = null;
  }

  private _unsubscribe:()=>void;

}

export class MetaForm extends MetaComponentBase<IFormProps, IFormState> {
	static childContextTypes = MetaComponentBase.contextTypes; 
	
  getChildContext() {
	  return {
      formContext: this.props.context
    };
	}

  constructor(props:IFormProps, context:any) {
    super(props, context);
    //if (null == props.context ) console.log("no context found in context for MetaForm", props);
    if (null == this.formContext || null == this.formContext.metamodel) {
      console.log("missing context info in MetaForm", props, context);
    }
    this.state = {
      viewmodel: this.formContext.viewmodel,
      currentPage: this.formContext.currentPage
    };
  }


  render() {
    let Wrapper = this.formContext.config.wrappers.form;

    /*
    let adjustedChildren = React.Children.map(this.props.children,
      (c) => React.cloneElement(c, {context: this.props.context}));
    */
    return (<Wrapper>
      <form id={this.formContext.metamodel.name} >
        {this.props.children}
      </form>
      </Wrapper>);
  }

  _updateState(context:IFormContext) {
    this.setState({
      viewmodel: context.viewmodel,
      currentPage: context.currentPage
    })
  }
}



export class MetaPage extends MetaComponentBase<IPageProps, IPageState> {

  static contextTypes = MetaForm_ContextTypes;

  constructor(props:IPageProps, context:any) {
    super(props, context);
    if (null == this.formContext || null == this.formContext.metamodel) {
      console.log("missing context info in MetaForm", props, context);
    }

  }
  render() {
    let context = this.formContext;

    if (this.props.page == context.currentPage) {
      let Wrapper = this.formContext.config.wrappers.page;
      return <Wrapper>{this.props.children}</Wrapper>;
    }
    return null;
  }

  _updatedState(context:IFormContext, initState:boolean) {
    var result = {
        currentPage: this.formContext.currentPage
    };
    if (initState) {
      this.state = result;
    } else {
      this.setState(result);
    }
    return result;
  }
}

function changeHandler(context:IFormContext, fieldName:string) {
  return (evt:React.FormEvent) => {
    let target = evt.target as any;
    if (target.type === "checkbox") {
      context.updateModel(fieldName, target.checked);
    } else {
      context.updateModel(fieldName, target.value);
    }
  }
}

export class MetaInput extends MetaComponentBase<IInputProps, IInputState> {
  constructor(props:IInputProps, context:any) {
    super(props, context);
    if (null == this.formContext) console.log("no context found for MetaInput", props);
    this._updatedState(this.formContext, true);
  }

  render() {
    let context = this.formContext;
    var fieldName = this.props.field;
    var fieldType = context.metamodel.subModel(fieldName);
    var field = fieldType && fieldType.asItemType();

    if (!field) {
      console.log(`field ${fieldName} not found in ${context.metamodel.name}`);
      return null;
    }

    let formid = this.formContext.metamodel.name;

    let theValue = (undefined !== this.state.fieldValue) ? this.state.fieldValue : ''; 

    let props:IInputComponentProps = { 
      id: formid+'#'+this.props.field,
      field: this.props.field,
      fieldType: fieldType,
      editable: context.viewmodel.isFieldEditable(this.props.field),
      hasErrors: (0 < this.state.fieldErrors.length),
      errors: this.state.fieldErrors,
      value: theValue,
      defaultValue: theValue,
      onChange: changeHandler(context, fieldName),
      context: context
    };

    let flavor = this.props.flavor || this.props.flavour;

    var Wrapper = context.config.wrappers.field;

    if (this.props.hasOwnProperty('wrapper')) {
      Wrapper = this.props.wrapper; 
    }

    var children:any;

    var Input:InputComponent;
    if (0 === React.Children.count(this.props.children)) {
      Input = context.config.findBest(field, fieldName, flavor);
      children = [ <Input {...props} /> ];
    } else {
      children = React.Children.map(this.props.children, (c) => {
        // avoid providing our props to html elements
        if (typeof((c as any).type) === 'string') return c;
        return React.cloneElement(c as JSX.Element, props);
      });
    }

    if (Wrapper) {
        return <Wrapper {...props}>{children}</Wrapper>;
    } else {
      return <div>{children}</div>
    }

  }

  _updatedState (context:IFormContext, initState:boolean) {
      let fieldName = this.props.field;
      let result = {
    	  fieldErrors: context.viewmodel.getFieldMessages(fieldName),
    	  fieldValue: context.viewmodel.getFieldValue(fieldName)
      };
      if (initState) {
        this.state = result;
      } else {
        this.setState(result);
      }
    }

  private _context:any;
}

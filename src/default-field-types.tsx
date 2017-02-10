
import * as React from 'react';

import {
  IModelType,
  IModelTypeComposite,
  ModelTypeArray
} from '@hn3000/metamodel';

import {
  IInputComponentProps,
  IInputComponentState,
  IFormWrapperProps, 
  IPageWrapperProps,
  IFieldWrapperProps 
} from './api';

import {
  MetaContextAwarePure
} from './base-components'

export class FieldWrapper extends React.Component<IFieldWrapperProps,void> {
  render() {
    var props:any = {};
    var errors:JSX.Element[] = [];
    if (this.props.hasErrors) {
      props['className'] = 'has-error'; 
    }
    return <div {...props}>
      {this.props.children}
      <div className="errors">There were errors:</div>
      {this.props.errors.map((e) => <div key={e.code} className="errors">{e.msg}</div>)}
    </div>;
  }
}
export class PageWrapper extends React.Component<IPageWrapperProps,void> {
  render() {
    return <div>{this.props.children}</div>;
  }
}
export class FormWrapper extends React.Component<IFormWrapperProps,void> {
  render() {
    let wrapperProps:any = {};
    if (this.props.busy) {
      wrapperProps.className = 'form-busy';
    }
    return <form method="POST" action="#" {...wrapperProps}>{this.props.children}</form>;
  }
}

export class MetaFormInputString extends React.Component<IInputComponentProps, IInputComponentState> {
  render() {
    let props = this.props;
    return <input type="text" placeholder={props.field} onChange={props.onChange} value={props.value}></input>;
  }
}

export class MetaFormInputNumber extends React.Component<IInputComponentProps, IInputComponentState> {
  render() {
    let props = this.props;
    return <input type="text" placeholder={this.props.field} onChange={props.onChange} value={props.value}></input>;
  }
}

export class MetaFormInputBool extends React.Component<IInputComponentProps, IInputComponentState> {
  render() {
    let props = this.props;
    return <input type="checkbox" onChange={props.onChange} checked={props.value}></input>;
  }
}

export class MetaFormInputEnumSelect extends React.Component<IInputComponentProps, IInputComponentState> {
  render() {
    let props = this.props;
    let vm = props.context.viewmodel;
    
    let values:any[] = vm.getPossibleFieldValues(props.field);
    if (null == values) {
      values = [];
    }
    let hasValue = null != props.value;
    return (<select onChange={props.onChange} value={props.value}>
      <option key={null} value={null} disabled={hasValue} hidden={hasValue}>choose one</option>
      {values.map((x:string)=> (<option key={x} value={x}>{x}</option>))}
    </select>);
  }
}

export class MetaFormInputEnumRadios extends React.Component<IInputComponentProps, IInputComponentState> {
  constructor(props:IInputComponentProps, context:any) {
    super(props, context);
    this._group = (Math.random()*Number.MAX_VALUE).toString(36);
  }
  render() {
    let props = this.props;
    let vm = props.context.viewmodel;
    
    let values:any[] = vm.getPossibleFieldValues(props.field);
    if (null == values) {
      values = [];
    }
    let group = this._group;
    let radios = values.map((x:string)=> (
      <label key={x+'_'+group}>
        <input type="radio" name={group} onChange={props.onChange} value={x} checked={x === props.value} />{x}
      </label>
    ));

    return <div>{radios}</div>;
  }

  private _group:string;
}

export class MetaFormInputEnumCheckbox extends React.Component<IInputComponentProps, IInputComponentState> {
  render() {
    let props = this.props;
    let fieldType = props.fieldType;
    
    let itemType = fieldType.asItemType();
    var values:any[] = [  ];
    if (null != itemType) {
      values = itemType.possibleValues();
    }

    let checkBoxes = values.map((x:string)=> (
      <label>
        <input type="checkbox" onChange={props.onChange} value={x} checked={x === props.value} />{x}
      </label>
    ));

    return <div>{checkBoxes}</div>;
  }
}

export class MetaFormInputEnumCheckboxArray extends React.Component<IInputComponentProps, IInputComponentState> {

  constructor(props: IInputComponentProps, context: any) {
    super(props, context);
    this.updateValue = this.updateValue.bind(this);
  }

  updateValue(ev: React.FormEvent<HTMLInputElement>) {
    let target = ev.target as HTMLInputElement;
    let value = (this.props.value as string[]) || [];
    if (target.checked) {
      if (-1 === value.indexOf(target.value)) {
        value = value.concat([ target.value ]);
      }
    } else {
      value = value.filter(x => x != target.value);
    }
    this.props.onChange(value);
  }

  render() {
    let props = this.props;
    let fieldType = props.fieldType as ModelTypeArray<any>;
    
    let itemType = fieldType.itemType().asItemType();
    var values:any[] = [  ];
    if (null != itemType) {
      values = itemType.possibleValues();
    }

    let checkBoxes = values.map((x:string)=> (
      <label key={x}>
        <input type="checkbox" onChange={this.updateValue} value={x} checked={-1 !== props.value.indexOf(x)} />{x}
      </label>
    ));

    return <div>{checkBoxes}</div>;
  }
}


export interface IFileInputState {
  dataurl:string;
  error?:string;
}

export class MetaFormInputFile extends React.Component<IInputComponentProps, IFileInputState> {
  constructor(props:IInputComponentProps, reactContext:any) {
    super(props, reactContext);

    this.state = { dataurl: null };
    this.handleFile = this.handleFile.bind(this);
    this.handleContents = this.handleContents.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleContents(evt:ProgressEvent) {
    console.log('loaded: ', evt.target);
    this.setState({ dataurl: ''+(evt.target as FileReader).result });
  }
  handleError(evt:ErrorEvent) {
    console.log('error: ', evt);
    this.setState({ error: ''+evt.error, dataurl: null });
  }

  handleFile(evt:React.FormEvent<HTMLElement>) {
    let files = (evt.target as HTMLInputElement).files; 
    if (files && files.length) {
      let first = files[0];
      let reader = new FileReader();
      reader.onloadend = this.handleContents;
      reader.onerror = this.handleError;
      reader.readAsDataURL(first);
      this.props.context.updateModel(this.props.field, {
        file: first,
        name: first.name
      });
    }
  }

  render() {
    let props = this.props;
    let state = this.state;
    return <div>
      <input type="file" onChange={this.handleFile} defaultValue={this.props.defaultValue.file}></input>
      { state.dataurl && <img src={state.dataurl} height="50" /> }
      { state.error && <span className="error">{state.dataurl}</span> }
    </div>;
  }
}



export class MetaFormUnknownFieldType extends React.Component<IInputComponentProps, IInputComponentState> {
  render() {
    return <input type="text" placeholder={this.props.field+": unknown kind"}></input>;
  }
}

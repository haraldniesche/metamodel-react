
import * as React from 'react';
import {
  IModelType,
  IModelTypeComposite,
  IModelTypeItem,
  IModelView,
  IModelParseMessage,
  IValidationMessage
} from '@hn3000/metamodel';


export interface IFormProps {
    context: IFormContext;
    currentPage?: number;
}
export interface IFormState {
    viewmodel:IModelView<any>;
    currentPage: number;
}

export interface IPageProps {
    context: IFormContext;
    page: number;
}
export interface IPageState {
    currentPage: number;
}
export interface IInputProps {
    context?: IFormContext;
    field: string;
    flavour?: string;
    flavor?: string;
}
export interface IInputState {
    fieldValue:any;
    fieldErrors: IValidationMessage[];
}

export interface IInputComponentProps extends IWrapperComponentProps {
    context?: IFormContext;
    field: string;
    fieldType: IModelType<any>;
    flavour?: string;
    flavor?: string;

    value?:any;
    defaultValue?:any;
    onChange?:(newValue:any)=>void;
}

export interface IInputComponentState extends IInputProps {
    flavour: string;
}

export interface IWrapperComponentProps {
    hasErrors?: boolean;
    errors?: IValidationMessage[];
}


export type InputComponent = React.ComponentClass<IInputComponentProps>;// | React.StatelessComponent<IInputComponentProps>;

export interface IComponentLookup {
    [key: string]: React.ReactType;
}
export interface IWrappers extends IComponentLookup {
    form: React.ComponentClass<IWrapperComponentProps>;  // </IWrapperComponentProps>
    page: React.ComponentClass<IWrapperComponentProps>;  // </IWrapperComponentProps>
    field: React.ComponentClass<IWrapperComponentProps>; // </IWrapperComponentProps>
}
export interface IComponentMatchFun {
    (...matchArgs: any[]): number;
}
export interface IComponentMatcher {
    matchQuality(...matchargs: any[]): number;
    component: InputComponent;
}
export interface IComponentFinder {
    findBest(...matchargs: any[]): InputComponent;
    add(matcher: IComponentMatcher): any;
    remove(matcher: IComponentMatcher): any;
}

export interface IFormConfig extends IComponentFinder {
  wrappers: IWrappers;
}

export interface IFormContext {
  config: IFormConfig;
  metamodel: IModelTypeComposite<any>;
  viewmodel: IModelView<any>;
  currentPage: number;

  /* 
   * similar to redux: returns the unsubscribe function
   * listeners always called asynchronously: validation runs before
   * listeners are notfied
   */
  subscribe(listener:()=>any):()=>void;

  //updated in place, viewmodel will change, though
  updateModel(field:string, value:any):void;

  updatePage(step:number):void;
  
  pageNext:(event:UIEvent)=>void;
  pageBack:(event:UIEvent)=>void;
}

/* /// <reference path="../typings/index.d.ts" /> */

export {
  IModelType,
  IModelTypeComposite,
  IModelTypeItem,
  IModelView,
  ValidationScope,
  ModelView,
  MessageSeverity,
  IStatusMessage,
  IPropertyStatusMessage,
  IClientProps,
  ClientProps
} from '@hn3000/metamodel';

export {
  IFormProps,
  IPageProps,
  IInputProps,
  IWrappers,
  IFormWrapperProps,
  IPageWrapperProps,
  IFieldWrapperProps,
  IWrapperComponentProps,
  IInputComponentProps,
  IInputComponentState,
  IComponentMatcher,
  IFormConfig,
  IFormContext,
  InputComponent,
  IModelUpdater,
  IConclusionMessage
} from './api';

export { propsDifferent } from './props-different';
export { parseSearchParams } from './search-params';

export { MetaFormConfig, MatchQ, matchQFun } from './form-config';
export { MetaFormContext } from './form-context';

export { MetaForm } from './meta-form';
export { MetaPage } from './meta-page';
export { MetaInput } from './meta-input';

export {
  MetaContextAware,
  MetaContextFollower,
  MetaContextAwarePure
} from './base-components';

import { IModelView } from '@hn3000/metamodel';
import { IModelUpdater, IFormContext } from './api';

export function chainUpdaters(...updaters:IModelUpdater[]):IModelUpdater {
    return (model:IModelView<any>, c:IFormContext) => {
        return updaters.reduce((m,u) => u(m,c), model);
    }
}

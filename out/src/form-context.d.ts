/// <reference types="react" />
import { IClientProps, ClientProps, IModelTypeComposite, IModelView } from '@hn3000/metamodel';
import { IConclusionMessage, IFormContext, IFormConfig, IModelUpdater } from './api';
import * as React from 'react';
export declare class MetaFormContext extends ClientProps implements IFormContext, IClientProps {
    constructor(config: IFormConfig, metamodel: IModelTypeComposite<any>, data?: any);
    pageNext: (event: React.SyntheticEvent<HTMLElement>) => void;
    pageBack: (event: React.SyntheticEvent<HTMLElement>) => void;
    hasNextPage(): boolean;
    hasPreviousPage(): boolean;
    isFinished(): boolean;
    isValid(): boolean;
    isPageValid(): boolean;
    readonly config: IFormConfig;
    readonly metamodel: IModelTypeComposite<any>;
    readonly viewmodel: IModelView<any>;
    readonly currentPage: number;
    getConclusion(): IConclusionMessage;
    setConclusion(conclusion: IConclusionMessage): void;
    subscribe(listener: () => any): () => void;
    updateModel(field: string, value: any): void;
    updateModelTransactional(updater: IModelUpdater, skipValidation?: boolean): void;
    private _debounceValidationTimeout;
    _updateViewModel(viewmodel: IModelView<any>): void;
    _notifyAll(): void;
    updatePage(step: number): void;
    isBusy(): boolean;
    private _promiseInFlight(promise);
    private _promiseResolved(promise);
    private _listeners;
    private _config;
    private _metamodel;
    private _viewmodel;
    private _promises;
    private _promisesBusyTime;
    private _promisesTimeout;
    private _conclusion;
}

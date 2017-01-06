/// <reference types="react" />
import { Primitive } from '@hn3000/metamodel';
import { IInputProps, IFormContext } from './api';
import { MetaContextFollower } from './base-components';
import * as React from 'react';
export declare class MetaInput extends MetaContextFollower<IInputProps, any> {
    static contextTypes: {
        formContext: React.Requireable<any>;
    };
    constructor(props: IInputProps, context: any);
    changeHandler(update: React.FormEvent<HTMLElement> | Primitive): void;
    nochangeHandler(): void;
    render(): JSX.Element;
    _extractState(context: IFormContext): any;
    private _context;
}

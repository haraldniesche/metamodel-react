"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_components_1 = require('./base-components');
var React = require('react');
var MetaForm = (function (_super) {
    __extends(MetaForm, _super);
    function MetaForm(props, context) {
        _super.call(this, props, context);
        //if (null == props.context ) console.log("no context found in context for MetaForm", props);
        this.state = {
            viewmodel: this.formContext.viewmodel,
            currentPage: this.formContext.currentPage
        };
    }
    MetaForm.prototype.getChildContext = function () {
        return {
            formContext: this.props.context
        };
    };
    MetaForm.prototype.render = function () {
        var Wrapper = this.formContext.config.wrappers.form;
        /*
        let adjustedChildren = React.Children.map(this.props.children,
          (c) => React.cloneElement(c, {context: this.props.context}));
        */
        return (React.createElement(Wrapper, null, 
            React.createElement("form", {id: this.formContext.metamodel.name}, this.props.children)
        ));
    };
    MetaForm.prototype._updateState = function (context) {
        this.setState({
            viewmodel: context.viewmodel,
            currentPage: context.currentPage
        });
    };
    MetaForm.childContextTypes = base_components_1.MetaContextAware.contextTypes;
    return MetaForm;
}(base_components_1.MetaContextFollower));
exports.MetaForm = MetaForm;
//# sourceMappingURL=meta-form.js.map
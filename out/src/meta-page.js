"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var base_components_1 = require("./base-components");
var meta_form_1 = require("./meta-form");
var MetaPage = (function (_super) {
    __extends(MetaPage, _super);
    function MetaPage(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._skipped = 0;
        return _this;
    }
    MetaPage.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
        var formContext = this.formContext;
        var nextFormContext = nextContext.formContext;
        var result = (!this.state
            || this.props.page === this.state.currentPage
            || nextProps.page === nextState.currentPage) && (true // super.shouldComponentUpdate(nextProps, nextState, nextContext)
        );
        if (result) {
            this._skipped = 0;
        }
        else {
            ++this._skipped;
        }
        console.log("page scu: " + nextProps.page + " " + result + " (skipped " + this._skipped + ")");
        return result;
    };
    MetaPage.prototype._extractState = function (context) {
        var newState = {
            currentPage: context.currentPage,
        };
        return newState;
    };
    MetaPage.prototype.render = function () {
        var context = this.formContext;
        if (this.props.page == context.currentPage) {
            var Wrapper = context.config.wrappers.page;
            console.log("rendering page " + this.props.page);
            if (null == this.props.contents) {
                return React.createElement(Wrapper, { busy: context.isBusy() }, this.props.children);
            }
            else {
                if (0 != React.Children.count(this.props.children)) {
                    console.log("warning: MetaPage ignores children if contents (" + this.props.contents + ") is specified");
                }
                var Contents = this.props.contents;
                return React.createElement(Wrapper, { busy: context.isBusy() },
                    React.createElement(Contents, null));
            }
        }
        console.log("not rendering page " + this.props.page + ", we're on " + context.currentPage);
        return null;
    };
    MetaPage.contextTypes = meta_form_1.MetaForm.childContextTypes;
    return MetaPage;
}(base_components_1.MetaContextFollower));
exports.MetaPage = MetaPage;
//# sourceMappingURL=meta-page.js.map
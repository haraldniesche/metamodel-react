"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var FieldWrapper = (function (_super) {
    __extends(FieldWrapper, _super);
    function FieldWrapper() {
        return _super.apply(this, arguments) || this;
    }
    FieldWrapper.prototype.render = function () {
        var props = {};
        var errors = [];
        if (this.props.hasErrors) {
            props['className'] = 'has-error';
        }
        return React.createElement("div", __assign({}, props),
            this.props.children,
            React.createElement("div", { className: "errors" }, "There were errors:"),
            this.props.errors.map(function (e) { return React.createElement("div", { key: e.code, className: "errors" }, e.msg); }));
    };
    return FieldWrapper;
}(React.Component));
exports.FieldWrapper = FieldWrapper;
var PageWrapper = (function (_super) {
    __extends(PageWrapper, _super);
    function PageWrapper() {
        return _super.apply(this, arguments) || this;
    }
    PageWrapper.prototype.render = function () {
        return React.createElement("div", null, this.props.children);
    };
    return PageWrapper;
}(React.Component));
exports.PageWrapper = PageWrapper;
var FormWrapper = (function (_super) {
    __extends(FormWrapper, _super);
    function FormWrapper() {
        return _super.apply(this, arguments) || this;
    }
    FormWrapper.prototype.render = function () {
        var wrapperProps = {};
        if (this.props.busy) {
            wrapperProps.className = 'form-busy';
        }
        return React.createElement("form", __assign({ method: "POST", action: "#" }, wrapperProps), this.props.children);
    };
    return FormWrapper;
}(React.Component));
exports.FormWrapper = FormWrapper;
var MetaFormInputString = (function (_super) {
    __extends(MetaFormInputString, _super);
    function MetaFormInputString() {
        return _super.apply(this, arguments) || this;
    }
    MetaFormInputString.prototype.render = function () {
        var props = this.props;
        return React.createElement("input", { type: "text", placeholder: props.field, onChange: props.onChange, value: props.value });
    };
    return MetaFormInputString;
}(React.Component));
exports.MetaFormInputString = MetaFormInputString;
var MetaFormInputNumber = (function (_super) {
    __extends(MetaFormInputNumber, _super);
    function MetaFormInputNumber() {
        return _super.apply(this, arguments) || this;
    }
    MetaFormInputNumber.prototype.render = function () {
        var props = this.props;
        return React.createElement("input", { type: "text", placeholder: this.props.field, onChange: props.onChange, value: props.value });
    };
    return MetaFormInputNumber;
}(React.Component));
exports.MetaFormInputNumber = MetaFormInputNumber;
var MetaFormInputBool = (function (_super) {
    __extends(MetaFormInputBool, _super);
    function MetaFormInputBool() {
        return _super.apply(this, arguments) || this;
    }
    MetaFormInputBool.prototype.render = function () {
        var props = this.props;
        return React.createElement("input", { type: "checkbox", onChange: props.onChange, checked: props.value });
    };
    return MetaFormInputBool;
}(React.Component));
exports.MetaFormInputBool = MetaFormInputBool;
var MetaFormInputEnumSelect = (function (_super) {
    __extends(MetaFormInputEnumSelect, _super);
    function MetaFormInputEnumSelect() {
        return _super.apply(this, arguments) || this;
    }
    MetaFormInputEnumSelect.prototype.render = function () {
        var props = this.props;
        var vm = props.context.viewmodel;
        var values = vm.getPossibleFieldValues(props.field);
        if (null == values) {
            values = [];
        }
        var hasValue = null != props.value;
        return (React.createElement("select", { onChange: props.onChange, value: props.value },
            React.createElement("option", { key: null, value: null, disabled: hasValue, hidden: hasValue }, "choose one"),
            values.map(function (x) { return (React.createElement("option", { key: x, value: x }, x)); })));
    };
    return MetaFormInputEnumSelect;
}(React.Component));
exports.MetaFormInputEnumSelect = MetaFormInputEnumSelect;
var MetaFormInputEnumRadios = (function (_super) {
    __extends(MetaFormInputEnumRadios, _super);
    function MetaFormInputEnumRadios(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this._group = (Math.random() * Number.MAX_VALUE).toString(36);
        return _this;
    }
    MetaFormInputEnumRadios.prototype.render = function () {
        var props = this.props;
        var vm = props.context.viewmodel;
        var values = vm.getPossibleFieldValues(props.field);
        if (null == values) {
            values = [];
        }
        var group = this._group;
        var radios = values.map(function (x) { return (React.createElement("label", { key: x + '_' + group },
            React.createElement("input", { type: "radio", name: group, onChange: props.onChange, value: x, checked: x === props.value }),
            x)); });
        return React.createElement("div", null, radios);
    };
    return MetaFormInputEnumRadios;
}(React.Component));
exports.MetaFormInputEnumRadios = MetaFormInputEnumRadios;
var MetaFormInputEnumCheckbox = (function (_super) {
    __extends(MetaFormInputEnumCheckbox, _super);
    function MetaFormInputEnumCheckbox() {
        return _super.apply(this, arguments) || this;
    }
    MetaFormInputEnumCheckbox.prototype.render = function () {
        var props = this.props;
        var fieldType = props.fieldType;
        var itemType = fieldType.asItemType();
        var values = [];
        if (null != itemType) {
            values = itemType.possibleValues();
        }
        var radios = values.map(function (x) { return (React.createElement("label", null,
            React.createElement("input", { type: "checkbox", onChange: props.onChange, value: x, checked: x === props.value }),
            x)); });
        return React.createElement("div", null, radios);
    };
    return MetaFormInputEnumCheckbox;
}(React.Component));
exports.MetaFormInputEnumCheckbox = MetaFormInputEnumCheckbox;
var MetaFormInputFile = (function (_super) {
    __extends(MetaFormInputFile, _super);
    function MetaFormInputFile(props, reactContext) {
        var _this = _super.call(this, props, reactContext) || this;
        _this.state = { dataurl: null };
        _this.handleFile = _this.handleFile.bind(_this);
        _this.handleContents = _this.handleContents.bind(_this);
        _this.handleError = _this.handleError.bind(_this);
        return _this;
    }
    MetaFormInputFile.prototype.handleContents = function (evt) {
        console.log('loaded: ', evt.target);
        this.setState({ dataurl: '' + evt.target.result });
    };
    MetaFormInputFile.prototype.handleError = function (evt) {
        console.log('error: ', evt);
        this.setState({ error: '' + evt.error, dataurl: null });
    };
    MetaFormInputFile.prototype.handleFile = function (evt) {
        var files = evt.target.files;
        if (files && files.length) {
            var first = files[0];
            var reader = new FileReader();
            reader.onloadend = this.handleContents;
            reader.onerror = this.handleError;
            reader.readAsDataURL(first);
            this.props.context.updateModel(this.props.field, {
                file: first,
                name: first.name
            });
        }
    };
    MetaFormInputFile.prototype.render = function () {
        var props = this.props;
        var state = this.state;
        return React.createElement("div", null,
            React.createElement("input", { type: "file", onChange: this.handleFile, defaultValue: this.props.defaultValue.file }),
            state.dataurl && React.createElement("img", { src: state.dataurl, height: "50" }),
            state.error && React.createElement("span", { className: "error" }, state.dataurl));
    };
    return MetaFormInputFile;
}(React.Component));
exports.MetaFormInputFile = MetaFormInputFile;
var MetaFormUnknownFieldType = (function (_super) {
    __extends(MetaFormUnknownFieldType, _super);
    function MetaFormUnknownFieldType() {
        return _super.apply(this, arguments) || this;
    }
    MetaFormUnknownFieldType.prototype.render = function () {
        return React.createElement("input", { type: "text", placeholder: this.props.field + ": unknown kind" });
    };
    return MetaFormUnknownFieldType;
}(React.Component));
exports.MetaFormUnknownFieldType = MetaFormUnknownFieldType;
//# sourceMappingURL=default-field-types.js.map
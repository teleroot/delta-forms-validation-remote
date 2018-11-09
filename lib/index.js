/**
 * Module contains implementation of class RemoteValidationRule
 *
 * @module index
 */

import * as parse from "qs/lib/parse";
import axios from "axios";
import {BaseRule} from "delta-forms/src/validation/rules/base-rule";

/**
 * Class represents server side validation rule for usage with DeltaJS forms library.
 *
 */
export class RemoteValidationRule extends BaseRule {
    /**
     * Getter for rule index name
     * @return {string}
     */
    static get indexName() {
        return "remote";
    }

    /**
     * Determines whether this rule should be used during validation after changing the value of target element.
     * @return {boolean}
     */
    get allowTrigger() {
        return this.options.trigger !== "no";
    }

    /**
     * Name of the query string parameter to pass the validated value
     * @return {string}
     */
    get valueParameterName() {
        return "v";
    }


    /**
     * Builds options for ajax request
     * @param {String} value Passed validated value
     * @return {Object} Options for external AJAX transport (axios, fetch etc.)
     */
    getAjaxOptions(value) {
        let params = {};


        let sparams = this.options.params;
        params[this.valueParameterName] = value.toString();
        if (sparams) {
            params = Object.assign({}, parse(sparams), params);
        }
        return {
            method: "get",
            url: this.options.url,
            params: params
        };
    }

    /**
     * Extracts data from HTTP response
     * @param {*} response
     * @return {*}
     */
    extractResponseValue(response) {
        return response.data;
    }

    /**
     * Check server response for validated value
     *
     * @param {Object} value Value to validate
     * @return {boolean} Determines if value is correct
     */
    validateResponseValue(value) {
        return (value + "") === this.options.valid;
    }

    /**
     * Overriden method for validation processing
     * @param {String|Object} value Value to validate
     * @return {Promise<boolean>} Server side validation result
     */
    async check(value) {
        const options = this.getAjaxOptions(value);
        const response = await axios(options);
        const responseValue = this.extractResponseValue(response);
        return this.validateResponseValue(responseValue);
    }
}

var util = require('util');
var xss = require('xss');
var moment = require('moment');

/**
	isValid class
	validation class that is heavily inspired from codeigniter
	How it works? instantiate a new object from the class passing your data array using the following format
	fieldName: fieldValue
 **/
var IsValid = function(data, errorMessages){
	this.reset();

	if(data) this.setData(data);

	if(errorMessages)
		this.setErrorMessages(errorMessages);
	else
		this.setErrorMessages(require('./errorMessages'));
};

/**
	reset
	reset validation state
 **/
IsValid.prototype.reset = function(){
	this.data = {};
	this.fields = {};
	this.errors = {};
	this.numberOfValidationTasks = 0;
};

/**
	setData
	set validation data
 **/
IsValid.prototype.setData = function(data){
	this.reset();
	this.data = data;
};

/**
	setErrorMessages
	set error messages
 **/
IsValid.prototype.setErrorMessages = function(errorMessages){
	this.errorMessages = errorMessages;
};

/**
	required
	validates that value is not undefined, null, NaN, empty string or digit zero
 **/
IsValid.prototype.required = function(value, options, callback){
	callback(Boolean(value && value.toString().length > 0), options);
};

/**
	execute a validation code if value has a value,
	otherwise call the callback with true
 **/
IsValid.prototype._validate = function(fn, value, options, callback){
	value? this[fn](value.toString(), options, callback): callback(true, options);
};

/**
	minLength
	options[0] == min length
	validates that value.length is greater than or equal to min length
 **/
IsValid.prototype.minLength = function(value, options, callback){
	callback(Boolean(value.length >= options[0]), options);
};

/**
	maxLength
	options[0] == max length
	validates that value.length is less than or equal to max length
 **/
IsValid.prototype.maxLength = function(value, options, callback){
	callback(Boolean(value.length <= options[0]), options);
};

/**
	exactLength
	options[0] == exact length
	validates that value.length is equal to exact length
 **/
IsValid.prototype.exactLength = function(value, options, callback){
	callback(Boolean(value.length == options[0]), options);
};

/**
	greaterThan
	options[0] == camprable
	validates that value is greater than comparable
 **/
IsValid.prototype.greaterThan = function(value, options, callback){
	callback(Boolean(parseInt(value) > parseInt(options[0])), options);
};

/**
	lessThan
	options[0] == camprable
	validates that value is less than comparable
 **/
IsValid.prototype.lessThan = function(value, options, callback){
	callback(Boolean(parseInt(value) < parseInt(options[0])), options);
};

/**
	alpha
	validates that value contains only alphabet characters
 **/
IsValid.prototype.alpha = function(value, options, callback){
	callback(Boolean(value.match(/^[a-z]+$/gi)), options);
};

/**
	alphaNumeric
	validates that value contains only alphabet and/or numbers characters
 **/
IsValid.prototype.alphaNumeric = function(value, options, callback){
	callback(Boolean(value.match(/^[a-z0-9]+$/gi)), options);
};

/**
	alphaNumericDash
	validates that value contains only alphabet, numbers and/or dash characters
 **/
IsValid.prototype.alphaNumericDash = function(value, options, callback){
	callback(Boolean(value.match(/^[a-z0-9\-]+$/gi)), options);
};

/**
	numeric
	validates that value contains only numbers
 **/
IsValid.prototype.numeric = function(value, options, callback){
	callback(Boolean(value.match(/^[0-9]+$/gi)), options);
};

/**
	integer
	validates that value is integer
 **/
IsValid.prototype.integer = function(value, options, callback){
	callback(Boolean(value.match(/^[\-\+]?[0-9]+$/gi)), options);
};

/**
	decimal
	validates that value is decimal number
 **/
IsValid.prototype.decimal = function(value, options, callback){
	callback(Boolean(value.match(/^[\-\+]?[0-9]+(\.[0-9]+)?$/gi)), options);
};

/**
	natural
	validates that value is natural number
 **/
IsValid.prototype.natural = function(value, options, callback){
	callback(Boolean(value.match(/^[\+]?[0-9]+?$/gi)), options);
};

/**
	naturalNoZero
	validates that value is a natural number and not zero
 **/
IsValid.prototype.naturalNoZero = function(value, options, callback){
	callback(Boolean(value.match(/^[\+]?[0-9]+?$/gi) && parseInt(value) > 0), options);
};

/**
	email
	validates that value looks like an email
 **/
IsValid.prototype.email = function(value, options, callback){
	callback(Boolean(value.match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/gi)), options);
};

/**
	regex
	options[0] == comparable pattern
	validates that value matches a given pattern
 **/
IsValid.prototype.regex = function(value, options, callback){
	var regularExpression = new RegExp(options.shift(), 'gi');
	callback(Boolean(value.match(regularExpression)), options);
};

/**
	matches
	options[0] == comparable value
	validates that value matches a given value
 **/
IsValid.prototype.matches = function(value, options, callback){
	callback(Boolean(value == options[0]), options);
};


/**
	list
	check if value is correctly format in a list way - strings separated by comma
**/
IsValid.prototype.list = function(value, options, callback){
	var list = value.split(',');

	for(var i = 0; i < list.length; i++)
	{
		if(!list[i])
			return callback(false, options);
	}

	return callback(true, options);
};

/**
	minListLength
	options[0] length
	check if list has the minimum amount of elements
**/
IsValid.prototype.minListLength = function(value, options, callback){
	var list = value.split(',');
	var length = options[0];

	return callback(Boolean(list.length >= length), options);
};

/**
	maxListLength
	options[0] length
	check if list exceeded the maximum amount of elements allowed
**/
IsValid.prototype.maxListLength = function(value, options, callback){
	var list = value.split(',');
	var length = options[0];

	return callback(Boolean(list.length <= length), options);
};

/**
	date
	checkes if value is in a good date shape
 **/
IsValid.prototype.date = function(value, options, callback){
	var date = moment(new Date(value)).format('X');
	return callback((date == 'Invalid date')? false : true, options)
};

/**
	beforeDate
	options[0] date
	checkes if date is before given date
**/
IsValid.prototype.beforeDate = function(value, options, callback){
	var date = moment(new Date(value)).format('X');
	var before = moment(new Date(options[0])).format('X');
	return callback(Boolean(date < before), options)
};

/**
	afterDate
	options[0] date
	checkes if date is after given date
**/
IsValid.prototype.afterDate = function(value, options, callback){
	var date = moment(new Date(value)).format('X');
	var after = moment(new Date(options[0])).format('X');
	return callback(Boolean(date > after), options)
};

/**
	boolean
	checkes if value is true or false
**/
IsValid.prototype.boolean = function(value, options, callback){
	return callback(Boolean(value === 'true' || value === 'false'), options)
};

/**
	sanitize
	returns the value after sanitized
 **/
IsValid.prototype.sanitize = function(value){
	if(value)
		return xss(value.toString().trim());
	return value;
};

/**
	rules that need options argument
 **/
IsValid.prototype.rulesWithOptions = ['minLength', 'maxLength', 'exactLength', 'greaterThan', 'lessThan', 'regex', 'matches', 'minListLength', 'maxListLength', 'beforeDate', 'afterDate'];

/**
	addRule
	args
		fieldName(property name in data object)
		friendly name for error messages
		rules spearated by |
 **/
IsValid.prototype.addRule = function (fieldName, friendlyName, rules){

	this.fields[fieldName] = {
		fieldName: fieldName,
		friendlyName: friendlyName,
		rules: []
	};

	var REGULAR_EXPRESSION = '#REGEX' + Math.random() + '#';

	var regex = rules.match(/regex\[.+\]/gi);

	if(regex && regex.length)
	{
		regex = regex[0];
		rules = rules.replace(regex, REGULAR_EXPRESSION);
	}

	rules = rules.split('|');

	if(regex)
	{
		for(var i = 0; i < rules.length; i++)
			rules[i] = rules[i].replace(REGULAR_EXPRESSION, regex);
	}

	for(var i = 0; i < rules.length; i++)
	{
		var options = rules[i].match(/\[.+\]/gi);

		if(options)
			options = options[0].replace('[','').replace(new RegExp(']$'),'').split(',');
		else
			options = [];

		var ruleName = rules[i].replace(/\[.+\]/gi,'');

		if(this[ruleName])
		{
			if(this.rulesWithOptions.indexOf(ruleName) != -1 && !options.length)
				throw new Error(ruleName + ' can\'t operate without options.');

			if(ruleName == 'matches')
				options[0] = this.data[options[0]];

			if(ruleName == 'regex')
			{
				try
				{
					new RegExp(options[0], 'gi');
				}
				catch(e)
				{
					throw new Error('regex expression is invalid.');
				}
			}

			if(ruleName == 'sanitize')
			{
				if(this.data[fieldName])
					this.data[fieldName] = this.sanitize(this.data[fieldName]);
			}
			else
			{
				this.numberOfValidationTasks++;

				var rule = {
					ruleName: ruleName,
					options: options
				};

				this.fields[fieldName].rules.push(rule);
			}
		}
		else
			throw new Error('rule doesn\'t exist.');
	}
};

/**
	run
	execute the validation rules logic returing error messages when there are validation errors and the new data field in case of success
 **/
IsValid.prototype.run = function(callback){

	if(this.numberOfValidationTasks == 0)
		return callback(null, this.data);

	var self = this;

	var numberOfCompletedValidationTasks = 0;

	var __callback = function(isValid, options){
		if(!isValid)
		{
			var fieldData = options[options.length - 1];

			delete options[options.length - 1];

			var errorMessageParams = [self.errorMessages[fieldData.ruleName], fieldData.friendlyName || fieldData.fieldName];

			for(var i = 0; i < options.length; i++)
			{
				if(options[i])
					errorMessageParams.push(options[i]);
			}

			var errorMessage = util.format.apply(self, errorMessageParams);
			self.errors[fieldData.fieldName].push(errorMessage);
		}

		numberOfCompletedValidationTasks++;

		if(numberOfCompletedValidationTasks === self.numberOfValidationTasks)
		{
			var numberOfErrorsFound = 0;

			for(var fieldName in self.errors)
			{
				if(self.errors[fieldName].length == 0)
				{
					delete self.errors[fieldName];
				}
				else
				{
					numberOfErrorsFound++;
					self.errors[fieldName] = (self.errors[fieldName]).join('<br>');
				}
			}

			callback(numberOfErrorsFound? self.errors : null, self.data);
		}
	};

	for(var fieldName in self.fields)
	{
		if(self.fields[fieldName].rules.length)
		{
			self.errors[fieldName] = [];

			for(var i = 0; i < self.fields[fieldName].rules.length; i++)
			{
				var value = self.data[fieldName];
				var options = self.fields[fieldName].rules[i].options;
				var fieldData = self.fields[fieldName];
				fieldData.ruleName = self.fields[fieldName].rules[i].ruleName;
				options.push(fieldData);

				if(self.fields[fieldName].rules[i].ruleName == 'required')
					self[self.fields[fieldName].rules[i].ruleName](value, options, __callback);
				else
					self._validate(self.fields[fieldName].rules[i].ruleName, value, options, __callback);
			}
		}
	}
};

module.exports = IsValid;

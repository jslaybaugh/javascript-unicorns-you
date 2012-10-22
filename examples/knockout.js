(function ()
{
	var me;

	var clearForm = function()
	{
		me.FirstName("");
		me.LastName("");
		me.Phone("");
		me.Error("");
	};

	this.ViewModel = Class.extend({
		init: function ()
		{
			me = this;

			me.ErrorPresent = ko.computed(function() { return me.Error().length > 0; });
		},

		FirstName: ko.observable(""),
		LastName: ko.observable(""),
		Phone: ko.observable(""),
		Error: ko.observable(""),
		ErrorPresent: undefined,
		People: ko.observableArray(),

		AddPerson: function()
		{
			me.People.push(new Person(me.FirstName(), me.LastName(), me.Phone()));
			clearForm();
		},

		RemovePerson: function(data)
		{
			if (confirm("are you sure?"))
			me.People.remove(data);
		}

	});

}).call(this);

(function ()
{
	var me;
	var phoneRegex = /^(\+[1]|[1])?(?:[\(-. /]*)(\d{3})(?:[\)-. /]*)(\d{3})(?:[-. /]*)(\d{4})(?:\s?[A-Za-z]*[,.]?\s?)(\d*)$/;
	var formatPhone = function (number)
	{
		if (number == null) return null;

		number = unformatPhone(number);

		if (number != null)
		{
			if (number.match(phoneRegex))
			{
				if ($.trim(number.replace(phoneRegex, "$5")).length > 0)
				{
					number = number = $.trim(number.replace(phoneRegex, "$1 ($2) $3-$4 ext. $5"))
				}
				else
				{
					number = number = $.trim(number.replace(phoneRegex, "$1 ($2) $3-$4"))
				}
			}
		}
		return number;
	};

	var unformatPhone = function (number)
	{
		if ($.trim(number.replace(phoneRegex, "$5")).length > 0)
			number = $.trim(number.replace(phoneRegex, "$1$2$3$4,$5"));
		else
			number = $.trim(number.replace(phoneRegex, "$1$2$3$4"));

		return number;
	};

	this.Person = Class.extend({
		init: function (firstName, lastName, phone)
		{
			me = this;
			me.FirstName(firstName);
			me.LastName(lastName);
			me.Phone(unformatPhone(phone));
			me.FormattedPhone = ko.computed(function() { return formatPhone(me.Phone()); })
			me.FullName = ko.computed(function() { return me.LastName() + ", " + me.FirstName(); });
		},

		FirstName: ko.observable(""),
		LastName: ko.observable(""),
		Phone: ko.observable(""),
		FormattedPhone: undefined,
		FullName: undefined,

		Call: function()
		{
			alert("Now Calling " + me.Phone());
		}

	});

}).call(this);
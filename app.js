    // BUDGET CONTROLLER

var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'expense') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'income'){
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);

            // Make it pubic
            return newItem;
        },

    }

})();





    // UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                descripton: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'income') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">+ %value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else if (type ==='expense') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">- %value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            var fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(currentItem, index, array) {
                currentItem.value = "";
            });

            fieldsArray[0].focus();

        }
    };

})();







    // GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListner = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
        
        if (event.keyCode === 13) {
            ctrlAddItem();
            }
        });
    };

    var updateBudget = function () {

            // Calculate the budget

            // Return the budget

            // Display the budget on the UI

    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the input data
        var input = UICtrl.getInput();

        if (input.value > 0 && input.descripton != '') {
            // 2. Add the item to the budget controller
            var newItem = budgetCtrl.addItem(input.type, input.descripton, input.value);

            // 3. Add the item to the UI AND clear the fields
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();

            // 4. Update
            updateBudget();
        
        } else {
            alert('You need to fill in the boxes');
        }

        };
    

    return {
        init: function() {
            console.log('Application starts');
            setupEventListner();
        }
    }

})(budgetController, UIController);

controller.init();







    /////////////////////////////////////////////////////////
    /////////////////// BUDGET CONTROLLER ///////////////////
    /////////////////////////////////////////////////////////

var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0){
           this.percentage = Math.round(( this.value / totalIncome ) * 100);
        } else {
            this.percentage = -1;
        }
    };



    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calcualteTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });

        data.totals[type] = sum;

    };

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },

        budget: 0,
        percentage: -1

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



        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },




        calculateBudget: function() {

            // Calculate the total income and expenses
            calcualteTotal('expense');
            calcualteTotal('income');

            // Calculate the budget( income - expenses )
            data.budget = data.totals.income - data.totals.expense;

            // Calculatethe the percentage of income that we spent
            if (data.totals.income > 0){
                data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
            } else {
                data.percentage = -1;
            }
        },




        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            }
        },

        calculatePercentages: function() {
            
            data.allItems.expense.forEach(function(current) {
                current.calcPercentage(data.totals.income);
            });
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.expense.map(function(current){
                return current.getPercentage();
            });
            return allPerc;
        }

    }

})();




    //////////////////////////////////////////////////
    //////////////// UI CONTROLLER ///////////////////
    //////////////////////////////////////////////////

var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function(num) {
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        dec = numSplit[1];

        return int + '.' + dec;
    }

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {

            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);

        },

        clearFields: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            var fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(currentItem, index, array) {
                currentItem.value = "";
            });

            fieldsArray[0].focus();

        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome);
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExpense);
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else if (obj.percentage === 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = 'BANKRUPT';
            }
        },

        diplayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0 ) {
                current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now, day, month, months, year;
            //My birthday var bir = new Date(1994, 12 , 21);

            now = new Date();
            day = now.getDay();
            months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month]+ ' ' + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        }
    };
})();






    ///////////////////////////////////////////////////////
    /////////////// GLOBAL APP CONTROLLER /////////////////
    ///////////////////////////////////////////////////////

var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListner = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
                }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

    };

    var updateBudget = function () {

            // Calculate the budget
            budgetCtrl.calculateBudget();

            // Return the budget
            var budget = budgetCtrl.getBudget();
            
            // Display the budget on the UI
            UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        // Calcualte the percentage
        budgetCtrl.calculatePercentages();
        // Read percentage from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // Update the UI with the new percentage
        UICtrl.diplayPercentages(percentages);
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
            updatePercentages();
        
        } else {
            alert('You need to fill in the boxes');
        }

    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // Update and show the new budget
            updateBudget();
            updatePercentages();
        }

    };

    
    

    return {
        init: function() {
            console.log('Application starts');
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: 0 
            });
            setupEventListner();
            UICtrl.displayMonth();
        }
    }

})(budgetController, UIController);

controller.init();







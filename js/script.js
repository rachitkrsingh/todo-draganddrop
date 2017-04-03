

    $(document).ready(function(){

        /******************************************************************************
        * Model Component
        ******************************************************************************/
        var Model = {
            todoList: [],
            inProgress: [],
            Completed : []
        }


        /******************************************************************************
        * Controller Component
        ******************************************************************************/

        var Controller = {
            init: function(){
                View.showLoader(true);
                Controller.getLocalStorage();
                var model = Model;

                View.init(model);

                Controller.formSubmit();
                
                View.showLoader(false);
                Controller.removeItemClickEvent();
            },
            formSubmit : function(){
                var that = Controller;
                 $("#todoForm").submit(function(event){
                    event.preventDefault();
                    that.getTaskValue();
                });
            },
            getTaskValue : function (){
                var $task = $("#taskInputField").val();
                if ($task && $task !== "undefined") {
                    var alreadyInTheModel = Controller.alreadyExists($task, "all");
                    if (!alreadyInTheModel) {
                        Controller.addItemToList($task, "todo");
                    } else {
                        View.itemAlreadyExists($task);
                    }
                   
                }
            },
            addItemToList : function(tsk, lName){
                var flag = Controller.alreadyExists(tsk, "todoList");
                if (!flag && lName === "todo") {
                    Model.todoList.push(tsk);
                    Controller.setLocalStorage();
                    View.renderCountOnload(Model);
                    View.addItemToView(tsk, "todoList");
                } else {
                    View.itemAlreadyExists(tsk);
                }

                Controller.removeItemClickEvent();
                
            },
           addItemToListOnDrag : function (task, listname){
               
               
                if (listname === "todo") {
                   
                    var flag = Controller.alreadyExists(task, "todoList");
                    if (!flag) {
                        Model.todoList.push(task);
                      
                    } else {
                        View.itemAlreadyExists(task);
                    }

                } else if (listname === "inprogress") {
                    
                    var flag = Controller.alreadyExists(task, "inProgress");
                    if (!flag) {
                        Model.inProgress.push(task);
                       
                    } else {
                        View.itemAlreadyExists(task);
                    }

                } else if (listname === "completed") {
                   var flag = Controller.alreadyExists(task, "Completed");
                    if (!flag) {
                        Model.Completed.push(task);
                       
                    } else {
                        View.itemAlreadyExists(task);
                    }
                }
                Controller.setLocalStorage();
            },
            setLocalStorage : function (){
                localStorage.setItem('AppLists', JSON.stringify(Model)); 
            },
            getLocalStorage : function (){
                var items =localStorage.getItem('AppLists'); 
                if (items && items !== undefined && items !== "null") {
                    Model = JSON.parse(items);
                }
                
            },
            dragAndDrop : function (item, listname, action){
                if (action === "add") {
                    if (listname === "todo") {
                        Controller.addItemToListOnDrag(item, listname);
                    } else if (listname === "inprogress") {
                        Controller.addItemToListOnDrag(item, listname);
                    } else if (listname === "completed") {
                        Controller.addItemToListOnDrag(item, listname);
                    }

                } else if (action === "remove") {
                    Controller.removeItemFromList(item, listname);
                }
                View.renderCountOnload(Model);
                Controller.removeItemClickEvent();

            },
            removeItemFromList: function(item, listname){
                var index = -1;
                if (listname === "todo") {
                    var todolist = Model.todoList;
                    for (var i = 0; i < todolist.length; i++) {
                        if (item === todolist[i]) {
                            index = i;
                        }
                    }
                    todolist.splice(index,1);
                    Model.todoList = todolist;
                } else if (listname === "inprogress") {
                     var inprogress = Model.inProgress;
                    for (var i = 0; i < inprogress.length; i++) {
                        if (item === inprogress[i]) {
                            index = i;
                        }
                    }
                    inprogress.splice(index,1);
                    Model.inProgress = inprogress;

                } else if (listname === "completed") {
                     var completed = Model.Completed;
                    for (var i = 0; i < completed.length; i++) {
                        if (item === completed[i]) {
                            index = i;
                        }
                    }
                    completed.splice(index,1);
                    Model.Completed = completed;

                }
                Controller.setLocalStorage();
            },
            alreadyExists : function (item, listname){
                var itm = item.toUpperCase();
               if (listname === "all") {
                    var itemInModel = Controller.searchItemInModel(itm);
                    return itemInModel;
               } else {
                    var list = Model[listname];
                    for (var i = 0; i <  list.length; i++) {
                        if (itm === list[i].toUpperCase()) {
                            return true;
                        }
                    }
                    return false;
               }
                
            },
            searchItemInModel : function (itm){
                var todoList = Model.todoList;
                var inProgress = Model.inProgress;
                var Completed = Model.Completed;
                for (var i = todoList.length - 1; i >= 0; i--) {
                    if (todoList[i].toUpperCase() === itm) {
                        return true;
                    }
                }
                for (var i = inProgress.length - 1; i >= 0; i--) {
                    if (inProgress[i].toUpperCase() === itm) {
                        return true;
                    }
                }
                for (var i = Completed.length - 1; i >= 0; i--) {
                    if (Completed[i].toUpperCase() === itm) {
                        return true;
                    }
                }
                return false
            },
            removeItemClickEvent : function (){
                var $removeItemButton = $('.js-remove-item');
                $($removeItemButton).on('click', function(event){
                    var $parentLi = $(this).parent();
                    var prev = $(this).prev();

                    var $parentUl = $($parentLi).parent();

                    var $listname = $($parentUl).attr('id');
                    var $taskName = $(prev).html();

                    $($parentLi).remove();

                    Controller.removeItemFromModel($listname, $taskName);

                    // var sibling = $(this).siblings();
                    // console.log(taskName);     
                    // console.log($(prev).html());
                    // console.log($(sibling[0]).html());
                });
            },
            removeItemFromModel : function(Ulname, task){
                var list = [];

                if (Ulname === "inprogressUl") {
                    list = Model.inProgress;
                    list.splice(list.indexOf(task),1);
                    Model.inProgress = list;
                    Controller.removeItemFromList("inprogress", task);
                   
                } else if (Ulname === "todoUl") {
                    list = Model.todoList;
                    list.splice(list.indexOf(task),1);
                    Model.todoList = list;
                    Controller.removeItemFromList("todo", task);

                } else if (Ulname === "completedUl") {
                    list = Model.Completed;
                    list.splice(list.indexOf(task),1);
                    Model.Completed = list;
                    Controller.removeItemFromList("completed", task);

                }

                View.init(Model);

            }
        };

        
        /******************************************************************************
        * View Component
        ******************************************************************************/
        var View = {
            init : function(data){
                if (data) {}
                View.renderCountOnload(data);
                View.addItemsOnload(data);
            },
            renderCountOnload : function (obj){
                var todoList = obj.todoList;
                var inProgress = obj.inProgress;
                var Completed = obj.Completed;

                var count = todoList.length + inProgress.length + Completed.length ;

                View.renderListCount("todoList", todoList.length);
                View.renderListCount("inProgress", inProgress.length);
                View.renderListCount("Completed", Completed.length);
                View.renderTotalCount(count);

            },
            renderTotalCount : function(c){
                $(".total-count span").html(c);
            },
            renderListCount : function(listName, count) {
                $("#"+listName + " .list-count").html(count);
            },
            addItemsOnload : function(listObj){
                
                var keys = View.getKeys(listObj);
                // console.log(keys);
                for (var i = 0; i <  keys.length; i++) {
                    var listName = keys[i];
                    var list = listObj[listName];

                    for (var j = 0; j < list.length ; j++) {
                        View.addItemToView(list[j], keys[i]);
                    }
                }
                
            },
            addItemToView : function(taskItem , taskType){
                if (taskType && taskType !== "undefined") {
                    var newItem;
                    var list =  $("#"+ taskType + " ul");                   

                    newItem = "<li><span>" + taskItem + "</span><div class='remove-list-item js-remove-item' >&#735;</div></li>";

                    list.append(newItem);
                } else {
                   console.log("Error in identifying List item type");
                }
               
            },
            getKeys : function (obj){
                 var keys = [];
                for(var k in obj) keys.push(k);
                    return keys;
            },
            showLoader: function(flag){
                if (flag) {
                    $("#loaderOverlay").addClass("show");
                } else {
                    $("#loaderOverlay").removeClass("show");
                }
                
            },
            itemAlreadyExists : function(item){
                alert(item + " Already Exists");
                console.log(item + " Already Exists");
            }
        };


        window.Initiate = Controller;
        Initiate.init();
        
    });

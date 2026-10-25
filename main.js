
document.addEventListener("DOMContentLoaded",main)

class Task{
    static tasks=[]
    static taskContainer=document.getElementById("taskContainer");
    static taskCounts=document.getElementById("counter");

    static deleteAll(){
        Task.taskContainer.textContent=""
        Task.tasks=[];
        countTasks();
    }

    constructor(newTask){
        
        this.taskBox= document.createElement("div")

        const checkTask = document.createElement("input")
        const task=document.createElement("p");
        
        this.taskBox.className="Task box";

        task.textContent=newTask;
        
        checkTask.type="checkbox";
        checkTask.addEventListener("change",this.markTask)
        
        this.taskBox.append(checkTask,task,...this.createTaskBtns());

        Task.taskContainer.prepend(this.taskBox)

    }
    
    markTask(){
        const completed = this.checked;

        completed?this.parentElement.classList.add("disabled"):this.parentElement.classList.remove("disabled");

        let button =  this.nextSibling.nextSibling
        button.disabled=completed;
        button.nextSibling.disabled=completed;

        countTasks()
    }
    
    createTaskBtns(){
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        editBtn.textContent="Edit";
        deleteBtn.textContent="Delete";
        deleteBtn.addEventListener('click',()=>{this.deleteTask(this)});
        editBtn.addEventListener("click",this.editTask);

        return [editBtn,deleteBtn];
    }

    editTask(){
        const task = this.previousSibling;
        let editBox;
        if(task.matches("p")){
            editBox = document.createElement("textarea");
            editBox.value=task.textContent;
            this.textContent="Done"

            task.previousSibling.disabled=true;
        }
        else{
            editBox =  document.createElement("p");
            editBox.textContent=task.value;
            this.textContent="Edit"

            task.previousSibling.disabled=false;
        }
        
        task.parentElement.replaceChild(editBox,task)
        
    }

    deleteTask(){
        const i = Task.tasks.indexOf(this)
        if(i!==-1) Task.tasks.splice(i,1);
        this.taskBox.remove()

        countTasks()
    }


}

function main(){
    const newTaskTextBox=document.getElementById("newTask");
    const title=document.getElementById("title");

    document.getElementById("clear").addEventListener("click",Task.deleteAll)

    document.getElementById("addTask").addEventListener("click",()=>{
        if(newTaskTextBox.value==="") return errorMessage("Enter a task");
        Task.tasks.push(new Task(newTaskTextBox.value));
        newTaskTextBox.value=null
        countTasks()
    })

    title.addEventListener("click",()=>{
        const titlebox=title.parentElement;
        const editTitle=document.createElement("input")

        editTitle.type="text"
        editTitle.value=title.textContent;
        titlebox.replaceChild(editTitle,title)

        editTitle.focus()

        editTitle.addEventListener("blur",()=>{
            title.textContent=editTitle.value||"Untitled";

            titlebox.replaceChild(title,editTitle)
        })


    })

    document.getElementById("save").addEventListener("click",saveData);
    document.getElementById("load").addEventListener("click",loadData);

    countTasks();
    loadData();

}


function countTasks(){
    let completed=0;
    Task.tasks.forEach((element)=>{
        element.taskBox.firstChild.checked?completed++:completed;
    })
    Task.taskCounts.textContent=`Tasks: ${Task.tasks.length} Completed: ${completed}`
    
}

function errorMessage(errorMsg){
    try {
        document.getElementById("error").textContent=errorMsg;
    } catch (error) {
        if(error instanceof TypeError){
            const errorBox=document.createElement("p");
            errorBox.id="error"
            Task.taskContainer.prepend(errorBox)
            errorMessage(errorMsg)
        }
        
    }
    finally{
        let toast=document.getElementById("error");
        try{setTimeout(()=>{
            toast.remove();
        },1000)
        }
        catch(er){}
    }
}

const Prefix="ToDo"

function saveData(){
    
    const title = document.getElementById("title").textContent;
    const taskList=[]
    for(let taskBox of Task.taskContainer.children){
        taskBox=taskBox.firstChild;
        taskList.push([taskBox.checked,taskBox.nextSibling.textContent])
    }
    localStorage.setItem(Prefix+"title",title);
    localStorage.setItem(Prefix+"taskList",JSON.stringify(taskList))
    
}

function loadData(){
    const title = localStorage.getItem(Prefix+"title")

    document.getElementById("title").textContent=title||"Untitled"

    try{
        const taskList=JSON.parse(localStorage.getItem(Prefix+"taskList"))
        for(let task of taskList.reverse()){
            const taskbox = new Task(task[1])
            Task.tasks.push(taskbox);
            taskbox.taskBox.firstChild.checked=task[0];
        }
    }
    catch(e){
        console.log(e)
    }
    countTasks()
}



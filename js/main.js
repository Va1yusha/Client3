const app = new Vue({
    el: '#app',
    data: {
        columns: [
            { title: 'Запланированные задачи', tasks: [] },
            { title: 'Задачи в работе', tasks: [] },
            { title: 'Тестирование', tasks: [] },
            { title: 'Выполненные задачи', tasks: [] }
        ],
        newTask: {
            title: '',
            description: '',
            deadline: ''
        },
        showModal: false
    },
    methods: {
        addTask() {
            if (this.newTask.title) {
                const task = {
                    ...this.newTask,
                    createdAt: new Date().toLocaleString(),
                    updatedAt: new Date().toLocaleString()
                };
                this.columns[0].tasks.push(task);
                this.newTask = { title: '', description: '', deadline: '' };
                this.showModal = false;
            }
        },
        deleteTask(columnIndex, taskIndex) {
            this.columns[columnIndex].tasks.splice(taskIndex, 1);
        },
        editTask(columnIndex, taskIndex, updatedTask) {
            const task = this.columns[columnIndex].tasks[taskIndex];
            Object.assign(task, updatedTask, { updatedAt: new Date().toLocaleString() });
        },
        moveTask(fromColumnIndex, toColumnIndex, taskIndex) {
            const task = this.columns[fromColumnIndex].tasks.splice(taskIndex, 1)[0];
            this.columns[toColumnIndex].tasks.push(task);
        },
        getNextColumnTitle(columnIndex) {
            switch (columnIndex) {
                case 0: return 'В Работу';
                case 1: return 'В Тестирование';
                case 2: return 'Выполнено';
                default: return '';
            }
        },
        checkDeadline(task) {
            const deadlineDate = new Date(task.deadline);
            const isOverdue = deadlineDate < new Date();
            return isOverdue ? 'Просроченная' : 'Выполненная в срок';
        }
    },
    template: `
         <div class="kanban-board">
             <div class="column" v-for="(column, columnIndex) in columns" :key="columnIndex">
                 <h2>{{ column.title }}</h2>
                 <div class="task" v-for="(task, taskIndex) in column.tasks" :key="taskIndex">
                     <h3>{{ task.title }}</h3>
                     <p><strong>Описание:</strong> {{ task.description }}</p>
                     <p><strong>Создано:</strong> {{ task.createdAt }}</p>
                     <p><strong>Обновлено:</strong> {{ task.updatedAt }}</p>
                     <p><strong>Дэдлайн:</strong> {{ task.deadline }}</p>
                     <button v-if="columnIndex < 3" @click="moveTask(columnIndex, columnIndex + 1, taskIndex)">
                         {{ getNextColumnTitle(columnIndex) }}
                     </button>
                     <button @click="deleteTask(columnIndex, taskIndex)">Удалить</button>
                 </div>
                 <button v-if="columnIndex === 0" @click="showModal = true">Добавить задачу</button>
             </div>
 
             <div v-if="showModal" class="modal">
                 <div class="modal-content">
                     <span class="close" @click="showModal = false">&times;</span>
                     <h2>Добавить задачу</h2>
                     <input v-model="newTask.title" placeholder="Заголовок задачи" />
                     <textarea v-model="newTask.description" placeholder="Описание задачи"></textarea>
                     <input type="date" v-model="newTask.deadline" />
                     <button @click="addTask">Добавить задачу</button>
                 </div>
             </div>
         </div>
    `
});

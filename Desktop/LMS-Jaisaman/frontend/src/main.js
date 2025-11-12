import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Toast from './components/Toast.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import { useToast } from './composables/useToast'
import { useConfirm } from './composables/useConfirm'

const app = createApp(App)

// Mount Toast component
const toastContainer = createApp(Toast)
const toastInstance = toastContainer.mount(document.createElement('div'))
document.body.appendChild(toastInstance.$el)

// Set toast instance globally
const { setToastInstance } = useToast()
setToastInstance(toastInstance)

// Mount Confirm Dialog component
const confirmContainer = createApp(ConfirmDialog)
const confirmInstance = confirmContainer.mount(document.createElement('div'))
document.body.appendChild(confirmInstance.$el)

// Set confirm instance globally
const { setConfirmInstance } = useConfirm()
setConfirmInstance(confirmInstance)

app.use(router).mount('#app')

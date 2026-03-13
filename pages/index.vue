<template>
  <div class="flex bg-[#0F0F0F] h-screen font-sans overflow-hidden">

    <!-- sidebar -->
    <div class="bg-[#0A0A0A] w-[320px] flex flex-col border-r border-white/5">

      <!-- header -->
      <div class="p-6 border-b border-white/5">
        <Logo />
        <div class="mt-5 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar notas..."
            class="w-full bg-white/5 border border-white/10 rounded-lg text-white text-xs pl-8 pr-3 py-2 placeholder:text-zinc-600 focus:outline-none focus:border-[#FFAC00]/50 transition-colors"
          />
        </div>
      </div>

      <!-- nueva nota -->
      <div class="px-4 pt-4">
        <button
          class="w-full flex items-center justify-center space-x-2 bg-[#FFAC00] hover:bg-[#e89d00] text-black text-xs font-bold rounded-lg px-4 py-2.5 transition-colors"
          @click="createNewNote"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Nueva nota</span>
        </button>
      </div>

      <!-- lista notas -->
      <div class="flex-grow overflow-y-auto px-4 pb-4 mt-2 scrollbar-hide">

        <!-- favoritas -->
        <template v-if="filteredFavoriteNotes.length > 0">
          <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-5 mb-2 px-2 flex items-center space-x-1">
            <svg class="w-3 h-3 text-[#FFAC00]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Favoritas</span>
          </p>
          <div class="space-y-1">
            <div
              v-for="note in filteredFavoriteNotes"
              :key="note.id"
              class="p-3 rounded-lg cursor-pointer transition-all duration-150 border"
              :class="note.id === selectedNote.id ? 'bg-[#FFAC00]/15 border-[#FFAC00]/30' : 'hover:bg-white/5 border-transparent'"
              @click="setNote(note)"
            >
              <h3 class="text-xs font-semibold truncate" :class="note.id === selectedNote.id ? 'text-[#FFAC00]' : 'text-zinc-200'">
                {{ note.title || note.text.trim().substring(0, 40) || 'Nota vacía' }}
              </h3>
              <p class="text-[10px] text-zinc-600 truncate mt-0.5">{{ note.text.trim().substring(0, 60) || 'Sin contenido' }}</p>
              <p class="text-[10px] text-zinc-700 mt-1">{{ formatTime(note.updatedAt) }}</p>
            </div>
          </div>
        </template>

        <!-- hoy -->
        <template v-if="filteredTodaysNotes.length > 0">
          <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-5 mb-2 px-2">Hoy</p>
          <div class="space-y-1">
            <div
              v-for="note in filteredTodaysNotes"
              :key="note.id"
              class="p-3 rounded-lg cursor-pointer transition-all duration-150 border"
              :class="note.id === selectedNote.id ? 'bg-[#FFAC00]/15 border-[#FFAC00]/30' : 'hover:bg-white/5 border-transparent'"
              @click="setNote(note)"
            >
              <h3 class="text-xs font-semibold truncate" :class="note.id === selectedNote.id ? 'text-[#FFAC00]' : 'text-zinc-200'">
                {{ note.title || note.text.trim().substring(0, 40) || 'Nota vacía' }}
              </h3>
              <p class="text-[10px] text-zinc-600 truncate mt-0.5">{{ note.text.trim().substring(0, 60) || 'Sin contenido' }}</p>
              <p class="text-[10px] text-zinc-700 mt-1">{{ formatTime(note.updatedAt) }}</p>
            </div>
          </div>
        </template>

        <!-- ayer -->
        <template v-if="filteredYesterdaysNotes.length > 0">
          <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-5 mb-2 px-2">Ayer</p>
          <div class="space-y-1">
            <div
              v-for="note in filteredYesterdaysNotes"
              :key="note.id"
              class="p-3 rounded-lg cursor-pointer transition-all duration-150 border"
              :class="note.id === selectedNote.id ? 'bg-[#FFAC00]/15 border-[#FFAC00]/30' : 'hover:bg-white/5 border-transparent'"
              @click="setNote(note)"
            >
              <h3 class="text-xs font-semibold truncate" :class="note.id === selectedNote.id ? 'text-[#FFAC00]' : 'text-zinc-200'">
                {{ note.title || note.text.trim().substring(0, 40) || 'Nota vacía' }}
              </h3>
              <p class="text-[10px] text-zinc-600 truncate mt-0.5">{{ note.text.trim().substring(0, 60) || 'Sin contenido' }}</p>
              <p class="text-[10px] text-zinc-700 mt-1">{{ new Date(note.updatedAt).toLocaleDateString('es-ES') }}</p>
            </div>
          </div>
        </template>

        <!-- anteriores -->
        <template v-if="filteredEarlierNotes.length > 0">
          <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-5 mb-2 px-2">Anteriores</p>
          <div class="space-y-1">
            <div
              v-for="note in filteredEarlierNotes"
              :key="note.id"
              class="p-3 rounded-lg cursor-pointer transition-all duration-150 border"
              :class="note.id === selectedNote.id ? 'bg-[#FFAC00]/15 border-[#FFAC00]/30' : 'hover:bg-white/5 border-transparent'"
              @click="setNote(note)"
            >
              <h3 class="text-xs font-semibold truncate" :class="note.id === selectedNote.id ? 'text-[#FFAC00]' : 'text-zinc-200'">
                {{ note.title || note.text.trim().substring(0, 40) || 'Nota vacía' }}
              </h3>
              <p class="text-[10px] text-zinc-600 truncate mt-0.5">{{ note.text.trim().substring(0, 60) || 'Sin contenido' }}</p>
              <p class="text-[10px] text-zinc-700 mt-1">{{ new Date(note.updatedAt).toLocaleDateString('es-ES') }}</p>
            </div>
          </div>
        </template>

        <!-- sin resultados -->
        <div
          v-if="searchQuery && filteredFavoriteNotes.length === 0 && filteredTodaysNotes.length === 0 && filteredYesterdaysNotes.length === 0 && filteredEarlierNotes.length === 0"
          class="text-center mt-12"
        >
          <p class="text-zinc-600 text-xs">No se encontraron notas</p>
          <p class="text-zinc-700 text-[10px] mt-1">para "{{ searchQuery }}"</p>
        </div>
      </div>

      <!-- footer sidebar -->
      <div class="p-4 border-t border-white/5 flex items-center justify-between">
        <span class="text-[10px] text-zinc-700">{{ notes.length }} {{ notes.length === 1 ? 'nota' : 'notas' }}</span>
        <button class="text-[10px] text-zinc-600 hover:text-zinc-300 font-medium transition-colors" @click="logout">
          Cerrar sesión
        </button>
      </div>
    </div>
    <!-- /sidebar -->

    <!-- área principal -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- toolbar -->
      <div class="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div class="flex items-center space-x-3 text-[10px] text-zinc-600">
          <span v-if="selectedNote.updatedAt">Editado {{ formatDate(selectedNote.updatedAt) }}</span>
          <span v-if="isSaving" class="text-[#FFAC00]/70 flex items-center space-x-1">
            <svg class="w-2.5 h-2.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>Guardando...</span>
          </span>
          <span v-else-if="lastSaved" class="text-zinc-700">✓ Guardado</span>
        </div>

        <div class="flex items-center space-x-1">
          <!-- favorito -->
          <button
            class="flex items-center space-x-1.5 text-[10px] font-medium px-3 py-1.5 rounded-lg transition-all"
            :class="selectedNote.isFavorite ? 'text-[#FFAC00] bg-[#FFAC00]/10' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'"
            @click="toggleFavorite"
          >
            <svg class="w-3.5 h-3.5" :fill="selectedNote.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>{{ selectedNote.isFavorite ? 'Favorita' : 'Favorito' }}</span>
          </button>

          <!-- exportar -->
          <button
            class="flex items-center space-x-1.5 text-[10px] text-zinc-500 hover:text-zinc-200 font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            @click="exportTxt"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <span>Exportar</span>
          </button>

          <!-- eliminar -->
          <button
            class="flex items-center space-x-1.5 text-[10px] text-zinc-500 hover:text-red-400 font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
            @click="deleteNote"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      <!-- editor -->
      <div class="flex-grow overflow-y-auto">
        <div class="max-w-[640px] mx-auto w-full px-8 py-10 flex flex-col h-full">

          <!-- título -->
          <input
            v-model="updatedTitle"
            type="text"
            placeholder="Título de la nota..."
            class="text-white text-xl font-semibold bg-transparent focus:outline-none placeholder:text-zinc-700 border-b border-white/5 pb-4 mb-6 w-full"
            @input="onTitleInput"
          />

          <!-- contenido -->
          <textarea
            ref="textarea"
            v-model="updatedNote"
            placeholder="Empieza a escribir tu nota..."
            class="text-zinc-300 text-[15px] leading-relaxed w-full bg-transparent focus:outline-none resize-none flex-grow placeholder:text-zinc-700 font-light tracking-wide"
            @input="onInput"
          />
        </div>
      </div>

      <!-- barra inferior -->
      <div class="px-8 py-3 border-t border-white/5 flex items-center justify-end space-x-4">
        <span class="text-[10px] text-zinc-700">{{ wordCount }} palabras</span>
        <span class="text-[10px] text-zinc-700">{{ updatedNote.length }} caracteres</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const updatedNote = ref('')
const updatedTitle = ref('')
const notes = ref([])
const selectedNote = ref({})
const textarea = ref(null)
const searchQuery = ref('')
const isSaving = ref(false)
const lastSaved = ref(false)

definePageMeta({
  middleware: ['auth'],
})

function formatTime(date) {
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(date) {
  const d = new Date(date)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return `hoy a las ${formatTime(date)}`
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ' a las ' + formatTime(date)
}

const wordCount = computed(() => {
  if (!updatedNote.value.trim()) return 0
  return updatedNote.value.trim().split(/\s+/).length
})

const filteredNotes = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return notes.value
  return notes.value.filter(n =>
    n.text.toLowerCase().includes(q) || (n.title || '').toLowerCase().includes(q)
  )
})

const filteredFavoriteNotes = computed(() =>
  filteredNotes.value.filter(n => n.isFavorite)
)

const filteredTodaysNotes = computed(() =>
  filteredNotes.value.filter(n => {
    if (n.isFavorite) return false
    return new Date(n.updatedAt).toDateString() === new Date().toDateString()
  })
)

const filteredYesterdaysNotes = computed(() => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return filteredNotes.value.filter(n => {
    if (n.isFavorite) return false
    return new Date(n.updatedAt).toDateString() === yesterday.toDateString()
  })
})

const filteredEarlierNotes = computed(() => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return filteredNotes.value.filter(n => {
    if (n.isFavorite) return false
    const d = new Date(n.updatedAt)
    return d < yesterday && d.toDateString() !== yesterday.toDateString()
  })
})

function setNote(note) {
  selectedNote.value = note
  updatedNote.value = note.text
  updatedTitle.value = note.title || ''
  lastSaved.value = false
}

function logout() {
  const jwtCookie = useCookie('NoteNestJWT')
  jwtCookie.value = null
  navigateTo('/login')
}

function exportTxt() {
  const content = `${updatedTitle.value}\n\n${updatedNote.value}`.trim()
  if (!content) return
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${updatedTitle.value || 'nota'}-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

async function toggleFavorite() {
  selectedNote.value.isFavorite = !selectedNote.value.isFavorite
  await $fetch(`/api/notes/${selectedNote.value.id}`, {
    method: 'PATCH',
    body: { isFavorite: selectedNote.value.isFavorite },
  })
}

async function deleteNote() {
  const { isConfirmed } = await Swal.fire({
    title: '¿Eliminar nota?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    background: '#0A0A0A',
    color: '#e4e4e7',
  })

  if (isConfirmed) {
    await $fetch(`/api/notes/${selectedNote.value.id}`, { method: 'DELETE' })
    const index = notes.value.findIndex(n => n.id === selectedNote.value.id)
    notes.value.splice(index, 1)
    if (notes.value.length > 0) setNote(notes.value[0])
    else await createNewNote()
  }
}

async function createNewNote() {
  try {
    const newNote = await $fetch('/api/notes', { method: 'POST' })
    notes.value.unshift(newNote)
    setNote(notes.value[0])
    await nextTick()
    textarea.value?.focus()
  } catch (err) {
    console.log(err)
  }
}

function onInput() {
  selectedNote.value.text = updatedNote.value
  lastSaved.value = false
  debouncedSave()
}

function onTitleInput() {
  selectedNote.value.title = updatedTitle.value
  lastSaved.value = false
  debouncedSave()
}

const debouncedSave = useDebounceFn(async () => {
  await updateNote()
}, 1000)

async function updateNote() {
  try {
    isSaving.value = true
    await $fetch(`/api/notes/${selectedNote.value.id}`, {
      method: 'PATCH',
      body: {
        title: updatedTitle.value,
        text: updatedNote.value,
      },
    })
    lastSaved.value = true
  } catch (err) {
    console.log(err)
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  notes.value = await $fetch('/api/notes')
  notes.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  if (notes.value.length > 0) setNote(notes.value[0])
  else await createNewNote()

  await nextTick()
  textarea.value?.focus()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
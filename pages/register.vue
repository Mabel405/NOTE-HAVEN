<template>
  <div class="min-h-screen bg-[#0C0C0C] flex">

    <!-- panel derecho: decorativo (primero en DOM pero a la derecha visualmente) -->
    <div class="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-[#080808] border-r border-white/5">

      <!-- patrón de puntos -->
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 32px 32px;" />

      <!-- glow central -->
      <div class="absolute w-[500px] h-[500px] bg-[#FFAC00]/10 rounded-full blur-[100px]" />

      <div class="relative text-center px-16">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFAC00]/10 border border-[#FFAC00]/20 mb-8">
          <svg class="w-8 h-8 text-[#FFAC00]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>
          </svg>
        </div>
        <h2 class="text-white text-2xl font-semibold tracking-tight mb-4">
          Empieza a escribir hoy
        </h2>
        <p class="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
          Crea tu cuenta gratis y comienza a capturar tus ideas en segundos.
        </p>

        <div class="mt-12 space-y-4 text-left max-w-xs mx-auto">
          <div v-for="feature in features" :key="feature" class="flex items-center space-x-3">
            <div class="w-5 h-5 rounded-full bg-[#FFAC00]/15 border border-[#FFAC00]/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-2.5 h-2.5 text-[#FFAC00]" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"/>
              </svg>
            </div>
            <span class="text-zinc-400 text-sm">{{ feature }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- panel derecho: formulario -->
    <div class="w-full lg:w-[480px] flex flex-col justify-center px-12 py-16 relative z-10">

      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFAC00]/5 rounded-full blur-[120px] pointer-events-none" />

      <div class="relative">
        <Logo />

        <div class="mt-12">
          <h1 class="text-white text-2xl font-semibold tracking-tight">
            Crea tu cuenta gratis
          </h1>
          <p class="text-zinc-500 text-sm mt-2 leading-relaxed">
            ¿Ya tienes cuenta?
            <nuxt-link
              to="/login"
              class="text-[#FFAC00] hover:text-[#ffc133] font-medium transition-colors"
            >
              Inicia sesión
            </nuxt-link>
          </p>
        </div>

        <form class="mt-10 space-y-5" @submit.prevent="submit">

          <!-- email -->
          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-2 tracking-wide uppercase">
              Correo electrónico
            </label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
              <input
                v-model="email"
                type="email"
                placeholder="tu@correo.com"
                class="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm pl-10 pr-4 py-3 placeholder:text-zinc-700 focus:outline-none focus:border-[#FFAC00]/50 focus:bg-white/[0.06] transition-all"
                :class="{ 'border-red-500/50': errors.email }"
              />
            </div>
            <p v-if="errors.email" class="text-red-400 text-xs mt-1.5">{{ errors.email }}</p>
          </div>

          <!-- contraseña -->
          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-2 tracking-wide uppercase">
              Contraseña
            </label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••••••"
                class="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm pl-10 pr-12 py-3 placeholder:text-zinc-700 focus:outline-none focus:border-[#FFAC00]/50 focus:bg-white/[0.06] transition-all"
                :class="{ 'border-red-500/50': errors.password }"
              />
              <button
                type="button"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-red-400 text-xs mt-1.5">{{ errors.password }}</p>

            <!-- indicador de fuerza de contraseña -->
            <div v-if="password" class="mt-2 space-y-1">
              <div class="flex space-x-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-0.5 flex-1 rounded-full transition-all duration-300"
                  :class="i <= passwordStrength.score ? passwordStrength.color : 'bg-white/10'"
                />
              </div>
              <p class="text-[10px]" :class="passwordStrength.textColor">{{ passwordStrength.label }}</p>
            </div>
          </div>

          <!-- botón -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-2 bg-[#FFAC00] hover:bg-[#e89d00] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-xl px-4 py-3.5 flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg shadow-[#FFAC00]/20 hover:shadow-[#FFAC00]/30"
          >
            <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>{{ isLoading ? 'Creando cuenta...' : 'Crear cuenta' }}</span>
            <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </button>

          <p class="text-center text-[11px] text-zinc-700">
            Al registrarte aceptas nuestros términos de uso y política de privacidad.
          </p>

        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const errors = ref({ email: '', password: '' })

const features = [
  'Cuenta gratuita para siempre',
  'Guardado automático en tiempo real',
  'Búsqueda instantánea en tus notas',
  'Exportación de notas en TXT',
]

const passwordStrength = computed(() => {
  const p = password.value
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  const levels = [
    { label: 'Muy débil', color: 'bg-red-500', textColor: 'text-red-400' },
    { label: 'Débil', color: 'bg-orange-500', textColor: 'text-orange-400' },
    { label: 'Regular', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
    { label: 'Fuerte', color: 'bg-green-500', textColor: 'text-green-400' },
  ]

  return { score, ...levels[Math.max(0, score - 1)] }
})

function validate() {
  errors.value = { email: '', password: '' }
  let valid = true

  if (!email.value) {
    errors.value.email = 'El correo es obligatorio'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Ingresa un correo válido'
    valid = false
  }

  if (!password.value) {
    errors.value.password = 'La contraseña es obligatoria'
    valid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Mínimo 6 caracteres'
    valid = false
  }

  return valid
}

async function submit() {
  if (!validate()) return

  isLoading.value = true
  try {
    await $fetch('/api/user', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    navigateTo('/')
  } catch (error) {
    const msg = error.response?._data?.message || 'Ocurrió un error inesperado'
    Swal.fire({
      title: 'Error al crear cuenta',
      text: msg,
      icon: 'error',
      confirmButtonText: 'Intentar de nuevo',
      background: '#0C0C0C',
      color: '#e4e4e7',
      confirmButtonColor: '#FFAC00',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
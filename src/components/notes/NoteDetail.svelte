<script lang="ts">
  // Definición de tipos
  interface Note {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    priority: 'high' | 'medium' | 'low';
    color: string;
  }

  // Props
  export let selectedNoteId: number | null = null;
  export let notes: Note[] = [];

  // Estado reactivo
  $: selectedNote = selectedNoteId ? notes.find(note => note.id === selectedNoteId) || null : null;

  // Función para obtener el color de prioridad
  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100/70 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200/50 dark:border-red-800/50';
      case 'medium':
        return 'bg-amber-100/70 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50';
      default:
        return 'bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50';
    }
  }
</script>

{#if !selectedNote}
  <div class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-lg shadow-lg border border-primary-200/50 dark:border-primary-700/50 p-6">
    <p class="text-primary-600 dark:text-primary-300 text-center">
      Selecciona una nota para ver sus detalles
    </p>
  </div>
{:else}
  <div class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-lg shadow-lg border border-primary-200/50 dark:border-primary-700/50">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100">
          {selectedNote.title}
        </h2>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-md {getPriorityColor(selectedNote.priority)}"
        >
          {selectedNote.priority}
        </span>
      </div>

      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-300">
            Categoría
          </p>
          <p class="mt-1 text-sm text-primary-900 dark:text-primary-100">
            {selectedNote.category}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-300">
            Contenido
          </p>
          <p class="mt-1 text-sm text-primary-900 dark:text-primary-100 whitespace-pre-line">
            {selectedNote.content}
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-300">
            Fecha de creación
          </p>
          <p class="mt-1 text-sm text-primary-900 dark:text-primary-100">
            {new Date(selectedNote.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}

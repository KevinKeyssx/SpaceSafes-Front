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
  export let notes: Note[] = [];
  
  // Estado
  let selectedNote: number | null = null;

  // Props para eventos
  export let onSelectNote: (noteId: number) => void;

  // Métodos
  function handleNoteClick(noteId: number): void {
    selectedNote = noteId;
    onSelectNote(noteId);
  }

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

<div class="bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-xl rounded-xl shadow-lg animate-fade-in border border-primary-200/50 dark:border-primary-700/50">
  <div class="p-8">
    <h2 class="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
      Notas
    </h2>
    <div class="space-y-4">
      {#each notes as note (note.id)}
        <div
          role="button"
          tabindex="0"
          on:click={() => handleNoteClick(note.id)}
          on:keydown={(e) => e.key === 'Enter' && handleNoteClick(note.id)}
          class="p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-102 group animate-slide-up backdrop-blur-lg
            {selectedNote === note.id
              ? 'bg-primary-100/40 dark:bg-primary-700/40 ring-2 ring-primary-400/50'
              : 'hover:bg-primary-50/40 dark:hover:bg-primary-700/40 hover:shadow-lg'
            }"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-semibold text-primary-900 dark:text-primary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              {note.title}
            </h3>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-transform duration-300 group-hover:scale-105 backdrop-blur-md {getPriorityColor(note.priority)}"
            >
              {note.priority}
            </span>
          </div>
          <p class="text-sm text-primary-600 dark:text-primary-300 line-clamp-2 group-hover:text-primary-900 dark:group-hover:text-primary-100 transition-colors duration-300">
            {note.content}
          </p>
          <div class="mt-3 flex items-center justify-between text-xs">
            <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-primary-100/50 dark:bg-primary-700/50 text-primary-700 dark:text-primary-300 font-medium transition-colors duration-300 group-hover:bg-primary-200/50 dark:group-hover:bg-primary-600/50 backdrop-blur-md">
              {note.category}
            </span>
            <span class="text-primary-500 dark:text-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-300">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

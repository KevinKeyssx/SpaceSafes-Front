<script lang="ts">
  import NoteList from './NoteList.svelte';
  import NoteDetail from './NoteDetail.svelte';

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
  let selectedNoteId: number | null = null;

  // Manejador para seleccionar una nota
  function handleSelectNote(noteId: number): void {
    selectedNoteId = noteId;
  }
</script>

<div class="flex flex-col lg:flex-row gap-6">
  <div class="lg:flex-1">
    <NoteList {notes} onSelectNote={handleSelectNote} />
  </div>
  <div class="lg:w-80">
    <NoteDetail {notes} {selectedNoteId} />
  </div>
</div>

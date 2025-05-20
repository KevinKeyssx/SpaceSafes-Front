<script lang="ts">
    import toast from "svelte-french-toast";

    import { successToast } from "@/config/toast/toast.config";
    import PasswordStrengthMeter from './PasswordStrengthMeter.svelte';
    import Slider from "../ui/bits/Slider.svelte";
    import OutlineButton from '../ui/Buttons/OutlineButton.svelte';
    import Input from '../ui/Inputs/Input.svelte';
    import Line from "../ui/Inputs/Line.svelte";
    import Switch from '../ui/Inputs/Switch.svelte';
    import KeyIcon from '@/icons/KeyIcon.svelte';

    type PasswordType = 'random' | 'memorable' | 'pin';


    export let password = '';
    export let usePassword: () => void;


    $: {
        if ( !password ) {
            generatePassword();
        }
    }


    let passwordLength = 12;
    let includeNumbers = true;
    let includeSpecialChars = true;
    let passwordType: PasswordType = 'random';
    let wordCount = 4;
    let pinLength = 6;


    const commonWords = [
        'apple', 'banana', 'orange', 'grape', 'lemon', 'peach', 'cherry', 'melon',
        'house', 'table', 'chair', 'window', 'door', 'floor', 'ceiling', 'wall',
        'water', 'fire', 'earth', 'wind', 'light', 'dark', 'sun', 'moon', 'star',
        'dog', 'cat', 'bird', 'fish', 'horse', 'tiger', 'lion', 'elephant', 'monkey',
        'happy', 'sad', 'angry', 'calm', 'brave', 'smart', 'kind', 'strong', 'fast',
        'blue', 'green', 'red', 'yellow', 'purple', 'orange', 'black', 'white', 'gray', 'brown',
    ];


    function generateRandom() {
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        if ( includeNumbers ) chars += '0123456789';

        if ( includeSpecialChars ) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let result = '';

        for ( let i = 0; i < passwordLength; i++ ) {
            result += chars.charAt( Math.floor(Math.random() * chars.length ));
        }

        return result;
    }


    function generateMemorable() {
        const selectedWords = [];

        for (let i = 0; i < wordCount; i++) {
            const randomIndex = Math.floor(Math.random() * commonWords.length);

            let word = commonWords[randomIndex];

            word = word.charAt(0).toUpperCase() + word.slice(1);
            selectedWords.push(word);
        }

        let result = selectedWords.join('');

        if ( includeNumbers ) {
            result += Math.floor(Math.random() * 100);
        }

        if ( includeSpecialChars ) {
            const specialChars = '!@#$%^&*()_+';
            result += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        }

        return result;
    }


    function generatePin() {
        let result = '';

        for ( let i = 0; i < pinLength; i++ ) {
            result += Math.floor( Math.random() * 10 );
        }

        return result;
    }


    function generatePassword() {
        password = {
            random: generateRandom(),
            memorable: generateMemorable(),
            pin: generatePin()
        }[passwordType];
    }


    function copyPassword() {
        navigator.clipboard.writeText( password );
        toast.success( 'Contraseña copiada correctamente.', successToast() );
    }
</script>

<div class="max-w-md mx-auto">
    <!-- Password display -->
    <div class=" space-y-2">
        <Input
            id="password"
            type="text"
            placeholder="Generar Contraseña"
            bind:value={password}
        />
        <PasswordStrengthMeter password={password} />
    </div>

    <Line className="mt-3 mb-2" />

    <span class="block text-sm font-medium text-gray-300 mb-2">Tipo de Contraseña</span>

    <div class="flex space-x-2">
        <OutlineButton
                onClick={() => {passwordType = 'random'; generatePassword()}}
                ariaLabel="Select random password type"
                classProp={`flex-1 text-primary-200 ${passwordType === 'random' ? '!bg-primary-600 text-white' : ''}`}
            >
                Random
            </OutlineButton>
        <OutlineButton
                onClick={() => {passwordType = 'memorable'; generatePassword()}}
                ariaLabel="Select memorable password type"
                classProp={`flex-1 text-primary-200 ${passwordType === 'memorable' ? '!bg-primary-600 text-white' : ''}`}
            >
                Palabras
            </OutlineButton>
        <OutlineButton
                onClick={() => {passwordType = 'pin'; generatePassword()}}
                ariaLabel="Select PIN password type"
                classProp={`flex-1 text-primary-200 ${passwordType === 'pin' ? '!bg-primary-600 text-white' : ''}`}
            >
                PIN
            </OutlineButton>
    </div>

    <Line className="my-3" />

    <div class="space-y-3">
        {#if passwordType === 'random'}
            <label for="length-slider" class="block text-sm font-medium text-primary-200 mb-1">
                Longitud: {passwordLength}
            </label>

            <Slider
                bind:value={passwordLength}
                min={8}
                max={100}
                onValueChange={generatePassword}
            />
        {:else if passwordType === 'memorable'}
            <label for="word-count-slider" class="block text-sm font-medium text-primary-200 mb-1">
                Palabras: {wordCount}
            </label>

            <Slider bind:value={wordCount} min={3} max={15} onValueChange={generatePassword} />
        {:else if passwordType === 'pin'}
            <label for="pin-length-slider" class="block text-sm font-medium text-primary-200 mb-1">
                Números: {pinLength}
            </label>

            <Slider
                bind:value={pinLength}
                min={3}
                max={20}
                onValueChange={generatePassword}
            />
        {/if}

        {#if passwordType !== 'pin'}
            <Switch
                bind:checked={includeNumbers}
                label="Números" id="include-numbers-memorable"
                padding="py-0"
                onChange={generatePassword}
            />

            <Line />

            <Switch
                bind:checked={includeSpecialChars}
                label="Símbolos" id="include-special-chars-memorable"
                padding="py-0"
                onChange={generatePassword}
            />
            <Line className="my-2" />
        {/if}
    </div>

    <div class="grid gap-2 mt-4 grid-cols-[0.2fr_0.2fr_1fr]">
    <OutlineButton onClick={generatePassword} ariaLabel="Generar Contraseña">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="32" stroke-dashoffset="32" d="M12 6c3.31 0 6 2.69 6 6c0 3.31 -2.69 6 -6 6c-3.31 0 -6 -2.69 -6 -6v-2.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="32;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M6 9l-3 3M6 9l3 3"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="6;0"/></path></g></svg>
    </OutlineButton>

    <OutlineButton onClick={copyPassword} ariaLabel="Copiar Contraseña">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="72" stroke-dashoffset="72" d="M12 3h7v18h-14v-18h7Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" stroke-width="1" d="M14.5 3.5v3h-5v-3"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="12;0"/></path><path stroke-dasharray="4" stroke-dashoffset="4" d="M9 10h3"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" values="4;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M9 13h5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.1s" dur="0.2s" values="6;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M9 16h6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.3s" dur="0.2s" values="8;0"/></path></g></svg>
    </OutlineButton>

    <button
        onclick={usePassword}
        class="flex w-full justify-center bg-primary-600 items-center mx-auto gap-2 ring-1 ring-primary-400 hover:bg-primary-700 text-white rounded-lg transition-colors px-4"
    >
        <KeyIcon />
        Utilizar
    </button>
</div>

</div>
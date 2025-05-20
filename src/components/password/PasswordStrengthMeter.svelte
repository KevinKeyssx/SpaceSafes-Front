<script lang="ts">
    export let password = '';

    let strengthScore = 0;
    let strengthPercentage = 0;
    let strengthColor = 'bg-red-500';
    let strengthText = 'Insegura';

    const calculateStrength = (pwd: string) => {
        let score = 0;

        if (!pwd) return 0;

        if (pwd.length < 8) {
            score += 0;
        } else if (pwd.length < 10) {
            score += 10;
        } else if (pwd.length < 12) {
            score += 20;
        } else {
            score += 30;
        }

        // Award points for character types
        let types = 0;
        if (/[a-z]/.test(pwd)) types++; // Lowercase
        if (/[A-Z]/.test(pwd)) types++; // Uppercase
        if (/[0-9]/.test(pwd)) types++; // Numbers
        if (/[^a-zA-Z0-9]/.test(pwd)) types++; // Symbols

        score += types * 15; // Max 60 points (4 * 15)

        if (pwd.length >= 8 && types >= 3) {
            score += 10;
        }

        return Math.min(Math.max(score, 0), 100);
    };

    $: {
        strengthScore = calculateStrength(password);
        strengthPercentage = strengthScore;

        if (strengthScore < 40) {
            strengthColor = 'bg-red-500';
            strengthText = 'Insegura';
        } else if (strengthScore < 70) {
            strengthColor = 'bg-yellow-500';
            strengthText = 'Regular';
        } else {
            strengthColor = 'bg-green-500';
            strengthText = 'Muy Segura';
        }
    }
</script>

<div class="w-full">
    <div class="flex justify-between text-sm text-primary-800 dark:text-primary-500 mb-1">
        <span>Seguridad:</span>
        <span>{strengthText} ({strengthPercentage}%)</span>
    </div>

    <div class="h-4 w-full rounded-full bg-gray-700">
        <div
            class="h-4 rounded-full transition-all duration-300 ease-in-out {strengthColor}"
            style="width: {strengthPercentage}%;"
        ></div>
    </div>
</div>

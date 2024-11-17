document.addEventListener('DOMContentLoaded', function () {
    const letterCount = document.getElementById('letterCount');
    const lettersContainer = document.getElementById('lettersContainer');
    const solverForm = document.getElementById('solverForm');

    function generateLetterBoxes (count, str) {
        if (!count || count <= 0) return;

        lettersContainer.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.className = 'letter-box';
            input.pattern = '[A-Za-z\\-]';

            if (str && str[i] && str[i].trim() !== '') {
                input.value = str[i];
            }

            lettersContainer.appendChild(input);
        }
    }

    function setSelectedOption (n) {
        letterCount.selectedIndex = n - 3;
    }

    function getLetterPattern () {
        const inputs = lettersContainer.getElementsByClassName('letter-box');
        return Array.from(inputs)
            .map(input => (input).value.trim() ?
                (input).value.toUpperCase() : '-')
            .join('');
    }

    letterCount.addEventListener('change', function () {
        generateLetterBoxes(parseInt(this.value));
    });

    solverForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const pattern = getLetterPattern();
        window.location.href = `/word/${pattern}`;
    });

    setSelectedOption(wordlen);
    generateLetterBoxes(wordlen, wordpattern);

    lettersContainer.addEventListener('keyup', function (e) {
        const target = e.target;
        if (target.classList.contains('letter-box')) {
            const inputs = Array.from(lettersContainer.getElementsByClassName('letter-box'));
            const currentIndex = inputs.indexOf(target);

            if (e.key === 'Backspace' && (target).value === '' && currentIndex > 0) {
                inputs[currentIndex - 1].focus();
            } else if ((target).value && currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            }
        }
    });
});
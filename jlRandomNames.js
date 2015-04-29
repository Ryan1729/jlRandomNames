/*jslint browser: true, devel: true*/

var rand_name = (function () {
    'use strict';
    
    //this function mimics c's rand function.
    function rand() {
        return Math.floor(
            Math.random()
                * (Number.MAX_SAFE_INTEGER || 9007199254740991)
        );
    }
    
    //this function returns true if a random roll (1-100) is lower then c.
    //So: rand_chance(20) has a 20% chance of returning true.
    function rand_chance(c) {
        return ((rand() % 100 + 1) <= c);
    }

    //this function returns a random int between 0 and i-1.
    function rand_choice(i) {
        return rand() % i;
    }

    function rand_name(len) {

        len = len || 16;
        
        // Very simple markov generator.
        // We repeat letters to make them more likely.
        var vowels = "aaaeeeiiiooouuyy'",
            frictive = "rsfhvnmz",
            plosive = "tpdgkbc",
            weird = "qwjx",
        // State transitions..
        // v -> f, p, w, v'
        // v' -> f, p, w
        // f -> p', v
        // p -> v, f'
        // w, p', f' -> v

            syllables = 0,
            state,
            pos = 0,
            prime = false,
            text = "";

        // Initial state choice
        if (rand_chance(30)) {
            state = 'v';
        } else if (rand_chance(40)) {
            state = 'f';
        } else if (rand_chance(70)) {
            state = 'p';
        } else {
            state = 'w';
        }

        while (pos < len - 1) {
            // Apply current state
            switch (state) {
            case 'v':
                text += vowels[rand_choice(vowels.length)];
                pos += 1;
                if (!prime) {
                    syllables += 1;
                }
                break;
            case 'f':
                text += frictive[rand_choice(frictive.length)];
                pos += 1;
                break;
            case 'p':
                text += plosive[rand_choice(plosive.length)];
                pos += 1;
                break;
            case 'w':
                text += weird[rand_choice(weird.length)];
                pos += 1;
                break;
            }

            // Chance to stop..
            if (syllables && pos >= 3) {
                if (rand_chance(20 + pos * 4)) {
                    break;
                }
            }

            // Transition...
            switch (state) {
            case 'v':
                if (!prime && rand_chance(10)) {
                    state = 'v';
                    prime = true;
                    break;
                } else if (rand_chance(40)) {
                    state = 'f';
                } else if (rand_chance(70)) {
                    state = 'p';
                } else {
                    state = 'w';
                }
                prime = false;
                break;
            case 'f':
                if (!prime && rand_chance(50)) {
                    prime = true;
                    state = 'p';
                    break;
                }
                state = 'v';
                prime = false;
                break;
            case 'p':
                if (!prime && rand_chance(10)) {
                    prime = true;
                    state = 'f';
                    break;
                }
                state = 'v';
                prime = false;
                break;
            case 'w':
                state = 'v';
                prime = false;
                break;
            }
        }
        
        
        return text[0].toUpperCase() + text.substring(1);

    }
    
    return rand_name;
}());
/* Coding Lab challenges (model solutions live in solutions/code-solutions.json, which is not committed). Marked on OUTPUT, not on exact code.
   Tests: T(inputs, spec, hidden) runs the program; F(call, expectedPython, hidden) calls a function.
   spec keys: lines · has · words · not · nums (+ mode "subseq", exact, tol, slack) · compact · regex · used · cs */
(() => {
const T = (i, o, h) => ({ i, o, h: !!h }), F = (call, ret, h, extra = {}) => ({ call, ret, h: !!h, ...extra });
const fizz = n => Array.from({ length: n }, (_, k) => { k++; return k % 15 === 0 ? "FizzBuzz" : k % 3 === 0 ? "Fizz" : k % 5 === 0 ? "Buzz" : String(k); });
BW.CODE = {
  id: "code", title: "Coding Lab", c1: "#0B1220", c2: "#22C55E", motif: "brackets",
  blurb: "Write real Python in the browser. Your programs are checked by running them against test cases, so any correct approach passes, not just one exact answer.",
  sections: [
    { id: "io", title: "Input & output", items: [
      { id: "hello", title: "Hello, World!", level: 1, brief: "Write a program that prints the message `Hello, World!`",
        starter: "# Print a message on the screen\n", tests: [T([], { has: ["hello", "world"] })], req: [], hints: ["Use the print() function.", "Text goes inside quotation marks: print(\"...\")"] },
      { id: "greet", title: "Personal greeting", level: 1, brief: "Ask the user for their name, then greet them by name, e.g. `Hello, Sam!`",
        starter: 'name = input("What is your name? ")\n', tests: [T(["Sam"], { has: ["hello", "sam"] }), T(["Priya"], { has: ["hello", "priya"] }, 1)], req: [], hints: ["input() gives you back what the user typed.", "Join strings with +, or use print(\"Hello,\", name)."] },
      { id: "rectangle", title: "Area of a rectangle", level: 1, brief: "Ask for the width and height of a rectangle (whole numbers) and print its area.",
        starter: 'width = int(input("Width: "))\n', tests: [T(["3", "4"], { nums: [12] }), T(["7", "6"], { nums: [42] }), T(["1", "1"], { nums: [1] }, 1), T(["12", "0"], { nums: [0] }, 1)], req: [], hints: ["int() turns the text the user typed into a whole number.", "Area = width × height."] },
      { id: "average3", title: "Average of three", level: 1, brief: "Ask for three numbers (they might be decimals) and print their mean average.",
        starter: "# Ask for three numbers, then print the average\n", tests: [T(["4", "5", "6"], { nums: [5], tol: .01 }), T(["1", "2", "2"], { nums: [1.6667], tol: .01 }), T(["10", "0", "5"], { nums: [5], tol: .01 }, 1), T(["2.5", "2.5", "4"], { nums: [3], tol: .01 }, 1)], req: [], hints: ["Use float() so decimals work.", "Add them up first, then divide by 3. Brackets matter!"] },
      { id: "minutes", title: "Minutes to hours", level: 2, brief: "Ask for a number of minutes and print it as hours and minutes, e.g. `135` → `2 hours 15 minutes`. Use `//` (DIV) and `%` (MOD).",
        starter: 'total = int(input("Minutes: "))\n', tests: [T(["135"], { nums: [2, 15] }), T(["59"], { nums: [0, 59] }), T(["240"], { nums: [4, 0] }, 1), T(["61"], { nums: [1, 1] }, 1)], req: [], hints: ["total // 60 gives the whole hours.", "total % 60 gives the minutes left over."] },
      { id: "vat", title: "Add VAT", level: 2, brief: "Ask for a price in pounds and print the price including 20% VAT, to 2 decimal places (e.g. `12.00`).",
        starter: 'price = float(input("Price: £"))\n', tests: [T(["10"], { nums: [12], regex: "\\d\\.\\d\\d(?!\\d)", regex_msg: "Show the price to 2 decimal places, e.g. 12.00" }), T(["2.50"], { nums: [3], regex: "\\d\\.\\d\\d(?!\\d)", regex_msg: "Show the price to 2 decimal places, e.g. 3.00" }), T(["19.99"], { nums: [23.99], tol: .001, regex: "\\d\\.\\d\\d(?!\\d)", regex_msg: "Show the price to 2 decimal places" }, 1)], req: [], hints: ["Adding 20% is the same as multiplying by 1.2.", "f\"{value:.2f}\" or round(value, 2) with formatting shows 2 decimal places."] }
    ] },
    { id: "sel", title: "Selection", items: [
      { id: "evenodd", title: "Odd or even", level: 1, brief: "Ask for a whole number. Print `Even` if it is even, otherwise print `Odd`.",
        starter: 'number = int(input("Enter a number: "))\n', tests: [T(["4"], { words: ["even"], not: ["odd"] }), T(["7"], { words: ["odd"], not: ["even"] }), T(["0"], { words: ["even"], not: ["odd"] }, 1), T(["-3"], { words: ["odd"], not: ["even"] }, 1)], req: ["if"], hints: ["n % 2 gives the remainder after dividing by 2.", "Even numbers have a remainder of 0."] },
      { id: "password", title: "Password check", level: 1, brief: "Ask for a password. If it is exactly `letmein` print `Access granted`, otherwise print `Access denied`.",
        starter: 'attempt = input("Password: ")\n', tests: [T(["letmein"], { has: ["granted"], not: ["denied"] }), T(["password"], { has: ["denied"], not: ["granted"] }), T(["LetMeIn"], { has: ["denied"], not: ["granted"] }, 1)], req: ["if"], hints: ["Compare with == (two equals signs).", "Passwords are case-sensitive, so LetMeIn should be denied."] },
      { id: "grade", title: "Grade boundaries", level: 2, brief: "Ask for a test score out of 100 and print the grade: `A` for 70+, `B` for 60–69, `C` for 50–59, otherwise `U`.",
        starter: 'score = int(input("Score: "))\n', tests: [T(["85"], { words: ["A"], not: ["B", "C", "U"], cs: true }), T(["65"], { words: ["B"], not: ["A", "C", "U"], cs: true }), T(["50"], { words: ["C"], not: ["A", "B", "U"], cs: true }), T(["49"], { words: ["U"], not: ["A", "B", "C"], cs: true }, 1), T(["70"], { words: ["A"], not: ["B", "C", "U"], cs: true }, 1)], req: ["if"], hints: ["Use if, elif and else.", "Check the highest boundary first, and watch the boundaries: 70 is an A."] },
      { id: "largest", title: "Largest of three", level: 2, brief: "Ask for three whole numbers and print the largest. Don't use `max()`: use selection instead.",
        starter: "a = int(input(\"First: \"))\n", tests: [T(["3", "9", "2"], { nums: [9] }), T(["8", "8", "1"], { nums: [8] }), T(["-5", "-2", "-9"], { nums: [-2] }, 1), T(["1", "2", "3"], { nums: [3] }, 1)], req: ["if", "no:max"], hints: ["Start by assuming the first number is the largest.", "Then compare each other number with your current largest."] },
      { id: "tickets", title: "Ticket prices", level: 2, brief: "Ask for someone's age. Children under 12 pay £5, people aged 65 or over pay £7, and everyone else pays £10. Print the price.",
        starter: 'age = int(input("Age: "))\n', tests: [T(["8"], { nums: [5] }), T(["30"], { nums: [10] }), T(["12"], { nums: [10] }, 1), T(["65"], { nums: [7] }, 1), T(["11"], { nums: [5] }, 1)], req: ["if"], hints: ["Think about the boundaries: 12 is not under 12.", "Use if / elif / else with three prices."] },
      { id: "leapyear", title: "Leap year", level: 3, brief: "Ask for a year and say whether it is a leap year. A year is a leap year if it divides by 4, unless it divides by 100, but years that divide by 400 are leap years. Print e.g. `2024 is a leap year` or `2023 is not a leap year`.",
        starter: 'year = int(input("Year: "))\n', tests: [T(["2024"], { words: ["leap"], not: ["not"] }), T(["2023"], { words: ["not"] }), T(["1900"], { words: ["not"] }, 1), T(["2000"], { words: ["leap"], not: ["not"] }, 1)], req: ["if"], hints: ["Use % to test if one number divides by another.", "Combine conditions with and / or. Brackets help."] }
    ] },
    { id: "loop", title: "Iteration", items: [
      { id: "count10", title: "Count to 10", level: 1, brief: "Print the numbers 1 to 10, each on its own line. Use a loop.",
        starter: "# Use a for loop\n", tests: [T([], { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], exact: true })], req: ["loop"], hints: ["range(1, 11) gives 1 up to 10.", "print(i) inside the loop."] },
      { id: "times", title: "Times table", level: 2, brief: "Ask for a number and print its times table from 1 to 12, e.g. `3 x 4 = 12`.",
        starter: 'n = int(input("Which times table? "))\n', tests: [T(["3"], { nums: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36], mode: "subseq", slack: 30 }), T(["7"], { nums: [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84], mode: "subseq", slack: 30 }, 1)], req: ["loop"], hints: ["Loop i from 1 to 12.", "Each line shows n, i and n * i."] },
      { id: "sumto", title: "Add them up", level: 2, brief: "Ask for a whole number n and print the total of 1 + 2 + … + n. Use a loop, not `sum()`.",
        starter: 'n = int(input("n: "))\ntotal = 0\n', tests: [T(["10"], { nums: [55] }), T(["4"], { nums: [10] }), T(["1"], { nums: [1] }, 1), T(["100"], { nums: [5050] }, 1)], req: ["loop", "no:sum"], hints: ["Start total at 0.", "Add each number to total inside the loop."] },
      { id: "countdown", title: "Countdown", level: 2, brief: "Ask for a starting number and count down to 1, one number per line, then print `Blast off!`",
        starter: 'start = int(input("Start from: "))\n', tests: [T(["5"], { nums: [5, 4, 3, 2, 1], has: ["blast off"] }), T(["3"], { nums: [3, 2, 1], has: ["blast off"] }, 1)], req: ["loop"], hints: ["range(start, 0, -1) counts down.", "Or use a while loop that subtracts 1 each time."] },
      { id: "valid", title: "Validation loop", level: 2, brief: "Keep asking for a number between 1 and 10 until the user types a valid one, then print `Thank you`.",
        starter: 'n = int(input("Number 1-10: "))\n', tests: [T(["15", "0", "7"], { has: ["thank"], used: 3 }), T(["3"], { has: ["thank"], used: 1 }, 1), T(["11", "-2", "100", "10"], { has: ["thank"], used: 4 }, 1)], req: ["while"], hints: ["A while loop repeats while a condition is true.", "Ask again inside the loop, otherwise it never ends."] },
      { id: "guess", title: "Guess the number", level: 2, brief: "The secret number is 7. Keep asking for guesses. Print `Too high` or `Too low` after a wrong guess, and `Correct` when they get it.",
        starter: "secret = 7\n", tests: [T(["3", "9", "7"], { has: ["too low", "too high", "correct"], used: 3 }), T(["7"], { has: ["correct"], not: ["too"], used: 1 }, 1), T(["10", "8", "1", "7"], { has: ["too high", "too high", "too low", "correct"], used: 4 }, 1)], req: ["loop"], hints: ["Loop while the guess isn't the secret.", "Ask for a new guess at the end of each loop."] },
      { id: "fizzbuzz", title: "FizzBuzz", level: 3, brief: "Print the numbers 1 to 30, but print `Fizz` for multiples of 3, `Buzz` for multiples of 5 and `FizzBuzz` for multiples of both.",
        starter: "for i in range(1, 31):\n    pass\n", tests: [T([], { lines: fizz(30) })], req: ["loop", "if"], hints: ["Check for multiples of both (15) first.", "i % 3 == 0 means i is a multiple of 3."] },
      { id: "avgloop", title: "Average of many", level: 3, brief: "Ask how many numbers there will be, then ask for each one, then print their average.",
        starter: 'count = int(input("How many numbers? "))\n', tests: [T(["3", "4", "5", "6"], { nums: [5], tol: .01, used: 4 }), T(["2", "1", "2"], { nums: [1.5], tol: .01, used: 3 }), T(["1", "9"], { nums: [9], tol: .01, used: 2 }, 1), T(["4", "10", "20", "30", "40"], { nums: [25], tol: .01, used: 5 }, 1)], req: ["loop"], hints: ["Loop count times, asking for a number each time.", "Keep a running total, then divide by count at the end."] }
    ] },
    { id: "str", title: "Strings", items: [
      { id: "reverse", title: "Reverse a word", level: 1, brief: "Ask for a word and print it backwards.",
        starter: 'word = input("Word: ")\n', tests: [T(["hello"], { words: ["olleh"], cs: true }), T(["Python"], { words: ["nohtyP"], cs: true }), T(["computer"], { words: ["retupmoc"], cs: true }, 1)], req: [], hints: ["word[::-1] reverses a string in Python.", "Or loop through the word and build a new string."] },
      { id: "vowels", title: "Count the vowels", level: 2, brief: "Ask for a sentence and print how many vowels (a, e, i, o, u, upper or lower case) it contains.",
        starter: 'sentence = input("Sentence: ")\ncount = 0\n', tests: [T(["Hello World"], { nums: [3] }), T(["AEIOU aeiou"], { nums: [10] }), T(["rhythm"], { nums: [0] }, 1), T(["Computer Science"], { nums: [6] }, 1)], req: ["loop"], hints: ["Loop through each character.", "ch.lower() in \"aeiou\" checks for a vowel."] },
      { id: "palindrome", title: "Palindrome checker", level: 2, brief: "Ask for a word and print whether it is a palindrome (reads the same backwards), ignoring capital letters. Print e.g. `Palindrome` or `Not a palindrome`.",
        starter: 'word = input("Word: ")\n', tests: [T(["Racecar"], { words: ["palindrome"], not: ["not"] }), T(["hello"], { words: ["not"] }), T(["Level"], { words: ["palindrome"], not: ["not"] }, 1), T(["ab"], { words: ["not"] }, 1)], req: ["if"], hints: ["Convert to lower case first.", "Compare the word with its reverse."] },
      { id: "initials", title: "Initials", level: 2, brief: "Ask for someone's full name and print their initials in capitals, e.g. `ada lovelace` → `AL`.",
        starter: 'name = input("Full name: ")\n', tests: [T(["ada lovelace"], { compact: "AL", cs: true }), T(["Alan Turing"], { compact: "AT", cs: true }), T(["grace brewster hopper"], { compact: "GBH", cs: true }, 1)], req: ["loop"], hints: ["name.split() splits the name into a list of words.", "word[0] is the first letter; .upper() makes it a capital."] },
      { id: "countchar", title: "Letter counter", level: 2, brief: "Ask for a sentence and then a single letter. Print how many times the letter appears, ignoring case. Don't use `.count()`.",
        starter: 'text = input("Sentence: ")\nletter = input("Letter: ")\n', tests: [T(["banana", "a"], { nums: [3] }), T(["Mississippi", "s"], { nums: [4] }), T(["Hello", "L"], { nums: [2] }, 1), T(["xyz", "a"], { nums: [0] }, 1)], req: ["loop", "no:count"], hints: ["Make both lower case so A and a match.", "Add 1 to a counter each time the characters match."] },
      { id: "caesar", title: "Caesar cipher", level: 3, brief: "Ask for a lower-case word and encrypt it by shifting each letter 3 places along the alphabet (x → a, y → b, z → c). Print the result.",
        starter: 'word = input("Word: ")\nresult = ""\n', tests: [T(["abc"], { words: ["def"], cs: true }), T(["xyz"], { words: ["abc"], cs: true }), T(["hello"], { words: ["khoor"], cs: true }, 1), T(["zebra"], { words: ["cheud"], cs: true }, 1)], req: ["loop"], hints: ["ord(\"a\") is 97; chr(97) is \"a\".", "Use % 26 so z wraps round to c."] }
    ] },
    { id: "list", title: "Lists & arrays", items: [
      { id: "listmax", title: "Biggest in a list", level: 2, brief: "Ask for 5 numbers, store them in a list, and print the biggest. Don't use `max()`.",
        starter: "numbers = []\n", tests: [T(["3", "9", "2", "7", "5"], { nums: [9], used: 5 }), T(["-4", "-9", "-1", "-7", "-3"], { nums: [-1], used: 5 }, 1), T(["5", "5", "5", "5", "5"], { nums: [5], used: 5 }, 1)], req: ["loop", "no:max"], hints: ["numbers.append(x) adds to the list.", "Keep track of the biggest so far as you loop."] },
      { id: "listavg", title: "Average from a list", level: 2, brief: "Ask the user to type numbers separated by commas (e.g. `4,8,15`) and print their average.",
        starter: 'text = input("Numbers: ")\n', tests: [T(["4,8,15"], { nums: [9], tol: .01 }), T(["1,2"], { nums: [1.5], tol: .01 }), T(["10"], { nums: [10], tol: .01 }, 1), T(["2.5,7.5,5,5"], { nums: [5], tol: .01 }, 1)], req: [], hints: ["text.split(\",\") makes a list of strings.", "Convert each one with float() before adding."] },
      { id: "countitems", title: "Count matches", level: 2, brief: "Write a function `count_items(items, x)` that returns how many times `x` appears in the list `items`. Don't use `.count()`.",
        starter: "def count_items(items, x):\n    pass\n", tests: [F("count_items([1, 2, 2, 3, 2], 2)", "3"), F('count_items(["a", "b"], "c")', "0"), F("count_items([], 5)", "0", 1), F("count_items([7, 7, 7], 7)", "3", 1)], req: ["def:count_items", "loop", "no:count"], hints: ["Start a counter at 0.", "return the counter at the end, don't print it."] },
      { id: "linsearch", title: "Linear search", level: 3, brief: "Write a function `linear_search(items, target)` that returns the index of `target` in the list, or `-1` if it isn't there. Don't use `.index()`.",
        starter: "def linear_search(items, target):\n    pass\n", tests: [F("linear_search([4, 8, 15, 16], 15)", "2"), F("linear_search([4, 8, 15, 16], 5)", "-1"), F("linear_search([9], 9)", "0", 1), F("linear_search([], 1)", "-1", 1), F('linear_search(["a", "b", "b"], "b")', "1", 1)], req: ["def:linear_search", "loop", "no:index"], hints: ["Loop through the positions with range(len(items)).", "Return as soon as you find it; return -1 after the loop."] },
      { id: "bubble", title: "Bubble sort", level: 3, brief: "Write a function `bubble_sort(items)` that returns the list sorted into ascending order using a bubble sort. Don't use `sorted()` or `.sort()`.",
        starter: "def bubble_sort(items):\n    items = items[:]\n    return items\n", tests: [F("bubble_sort([5, 1, 4, 2, 8])", "[1, 2, 4, 5, 8]"), F("bubble_sort([3, 2, 1])", "[1, 2, 3]"), F("bubble_sort([])", "[]", 1), F("bubble_sort([1, 2, 3])", "[1, 2, 3]", 1), F("bubble_sort([9, -1, 9, 0])", "[-1, 0, 9, 9]", 1)], req: ["def:bubble_sort", "loop", "no:sorted", "no:sort"], hints: ["Compare neighbouring items and swap if they're in the wrong order.", "Repeat passes until the list is sorted."] }
    ] },
    { id: "func", title: "Subroutines", items: [
      { id: "iseven", title: "is_even()", level: 1, brief: "Write a function `is_even(n)` that returns `True` if n is even and `False` if not.",
        starter: "def is_even(n):\n    pass\n", tests: [F("is_even(4)", "True"), F("is_even(7)", "False"), F("is_even(0)", "True", 1), F("is_even(-3)", "False", 1)], req: ["def:is_even", "return"], hints: ["return sends a value back from the function.", "n % 2 == 0 is already True or False."] },
      { id: "ctof", title: "Celsius to Fahrenheit", level: 1, brief: "Write a function `c_to_f(c)` that returns the temperature in Fahrenheit using F = C × 9 ÷ 5 + 32.",
        starter: "def c_to_f(c):\n    pass\n", tests: [F("c_to_f(0)", "32"), F("c_to_f(100)", "212"), F("c_to_f(-40)", "-40", 1), F("c_to_f(37)", "98.6", 1)], req: ["def:c_to_f", "return"], hints: ["Return the calculation, don't print it.", "Multiply by 9, divide by 5, then add 32."] },
      { id: "factorial", title: "Factorial", level: 2, brief: "Write a function `factorial(n)` that returns n! (e.g. 5! = 5 × 4 × 3 × 2 × 1 = 120). 0! is 1.",
        starter: "def factorial(n):\n    pass\n", tests: [F("factorial(5)", "120"), F("factorial(1)", "1"), F("factorial(0)", "1", 1), F("factorial(10)", "3628800", 1)], req: ["def:factorial", "return"], hints: ["Start with result = 1.", "Multiply by every number from 2 up to n."] },
      { id: "circle", title: "Area of a circle", level: 2, brief: "Write a function `area_circle(r)` that returns the area of a circle (π r²) rounded to 2 decimal places. Use `math.pi`.",
        starter: "import math\n\ndef area_circle(r):\n    pass\n", tests: [F("area_circle(5)", "78.54", 0, { tol: 1e-9 }), F("area_circle(1)", "3.14", 0, { tol: 1e-9 }), F("area_circle(0)", "0", 1, { tol: 1e-9 }), F("area_circle(2.5)", "19.63", 1, { tol: 1e-9 })], req: ["def:area_circle", "return"], hints: ["r ** 2 is r squared.", "round(value, 2) rounds to 2 decimal places."] },
      { id: "maxof3", title: "Biggest of three", level: 2, brief: "Write a function `biggest(a, b, c)` that returns the largest of three numbers without using `max()`.",
        starter: "def biggest(a, b, c):\n    pass\n", tests: [F("biggest(1, 2, 3)", "3"), F("biggest(9, 2, 5)", "9"), F("biggest(4, 8, 8)", "8", 1), F("biggest(-1, -5, -3)", "-1", 1)], req: ["def:biggest", "if", "no:max"], hints: ["Compare the numbers with if statements.", "Remember two might be equal."] },
      { id: "isprime", title: "Prime checker", level: 3, brief: "Write a function `is_prime(n)` that returns `True` if n is a prime number and `False` otherwise. Numbers below 2 aren't prime.",
        starter: "def is_prime(n):\n    pass\n", tests: [F("is_prime(2)", "True"), F("is_prime(17)", "True"), F("is_prime(21)", "False"), F("is_prime(1)", "False", 1), F("is_prime(97)", "True", 1), F("is_prime(0)", "False", 1), F("is_prime(49)", "False", 1)], req: ["def:is_prime", "loop"], hints: ["Try dividing n by every number from 2 up to n - 1.", "If any divides exactly (n % d == 0) it isn't prime."] }
    ] },
    { id: "alg", title: "Exam algorithms", items: [
      { id: "validpw", title: "Password rules", level: 2, brief: "Write a function `valid_password(p)` that returns `True` only if the password is at least 8 characters long and contains at least one digit.",
        starter: "def valid_password(p):\n    pass\n", tests: [F('valid_password("secret12")', "True"), F('valid_password("short1")', "False"), F('valid_password("nodigitshere")', "False", 1), F('valid_password("12345678")', "True", 1)], req: ["def:valid_password"], hints: ["len(p) gives the length.", "ch.isdigit() is True for 0–9."] },
      { id: "bintoden", title: "Binary to denary", level: 3, brief: "Write a function `binary_to_denary(bits)` that takes a string like `\"1010\"` and returns the denary value (10). Use a loop rather than `int(bits, 2)`.",
        starter: "def binary_to_denary(bits):\n    pass\n", tests: [F('binary_to_denary("1010")', "10"), F('binary_to_denary("11111111")', "255"), F('binary_to_denary("0")', "0", 1), F('binary_to_denary("10000000")', "128", 1)], req: ["def:binary_to_denary", "loop"], hints: ["Each step: value = value × 2 + next bit.", "Or add up place values 128, 64, 32 …"] },
      { id: "dentobin", title: "Denary to binary", level: 3, brief: "Write a function `denary_to_binary(n)` that returns n (0–255) as an 8-bit binary string, e.g. `10` → `\"00001010\"`. Don't use `bin()` or `format()`.",
        starter: "def denary_to_binary(n):\n    pass\n", tests: [F("denary_to_binary(10)", '"00001010"'), F("denary_to_binary(255)", '"11111111"'), F("denary_to_binary(0)", '"00000000"', 1), F("denary_to_binary(128)", '"10000000"', 1)], req: ["def:denary_to_binary", "loop", "no:bin", "no:format"], hints: ["n % 2 gives the last bit; n // 2 moves to the next.", "Build the string from right to left 8 times."] },
      { id: "binsearch", title: "Binary search", level: 3, brief: "Write a function `binary_search(items, target)` for a sorted list. Return the index of `target`, or `-1` if it isn't there. Don't use `.index()`.",
        starter: "def binary_search(items, target):\n    low = 0\n    high = len(items) - 1\n", tests: [F("binary_search([2, 5, 8, 12, 16, 23], 12)", "3"), F("binary_search([2, 5, 8, 12, 16, 23], 7)", "-1"), F("binary_search([1], 1)", "0", 1), F("binary_search([], 3)", "-1", 1), F("binary_search(list(range(0, 100, 3)), 99)", "33", 1)], req: ["def:binary_search", "while", "no:index"], hints: ["Look at the middle item: mid = (low + high) // 2.", "Move low up or high down to discard half each time."] }
    ] },
    { id: "files", title: "File handling", items: [
      { id: "filescore", title: "High score file", level: 3, brief: "The file `scores.txt` has one player per line, like `Sam,12`. Print the name of the player with the highest score.",
        starter: 'file = open("scores.txt", "r")\n', tests: [{ i: [], files: { "scores.txt": "Sam,12\nAva,19\nBen,7\n" }, o: { words: ["Ava"], not: ["Sam", "Ben"] }, h: false }, { i: [], files: { "scores.txt": "Zed,3\nMia,40\n" }, o: { words: ["Mia"], not: ["Zed"] }, h: true }, { i: [], files: { "scores.txt": "Lo,100\nHi,99\nMid,50\n" }, o: { words: ["Lo"], not: ["Hi", "Mid"] }, h: true }], req: ["file", "loop"], hints: ["Loop over the file line by line.", "line.strip().split(\",\") separates the name and score."] },
      { id: "filewords", title: "Longest word in a file", level: 3, brief: "The file `words.txt` has one word per line. Print how many words there are and then the longest word.",
        starter: 'file = open("words.txt", "r")\n', tests: [{ i: [], files: { "words.txt": "cat\nelephant\ndog\n" }, o: { nums: [3], words: ["elephant"] }, h: false }, { i: [], files: { "words.txt": "binary\nbit\nalgorithm\nbyte\n" }, o: { nums: [4], words: ["algorithm"] }, h: true }], req: ["file"], hints: ["Read each line and strip() the newline.", "Keep the longest word seen so far."] }
    ] }
    ,
    { id: "fill", title: "Finish the code", kind: "fill", items: [
      { id: "fillavg", title: "Finish: class average", level: 1, brief: "Part of this program is written for you. It asks how many scores there are, then reads each one. Finish it so it adds up the scores and prints the average.",
        starter: `count = int(input("How many scores? "))
total = 0
for i in range(count):
    score = int(input("Score: "))
    # 1. add score to total
    pass
# 2. print the average (total divided by count)
`, tests: [T(["3", "10", "20", "30"], { nums: [20], tol: .01, used: 4 }), T(["2", "7", "8"], { nums: [7.5], tol: .01, used: 3 }), T(["4", "1", "2", "3", "4"], { nums: [2.5], tol: .01 }, 1), T(["1", "9"], { nums: [9], tol: .01 }, 1)],
        req: ["keep:for i in range(count):", 'keep:score = int(input("Score: "))'], hints: ["Replace `pass` with a line that adds `score` to `total`.", "After the loop (not indented), divide `total` by `count`."] },
      { id: "fillage", title: "Finish: age check", level: 1, brief: "Finish `valid_age(age)` so it returns `True` for ages 11 to 18 inclusive, and `False` for anything else.",
        starter: `def valid_age(age):
    # return True if age is between 11 and 18 (inclusive)
    pass
`, tests: [F("valid_age(11)", "True"), F("valid_age(19)", "False"), F("valid_age(18)", "True", 1), F("valid_age(10)", "False", 1), F("valid_age(15)", "True", 1)],
        req: ["def:valid_age", "return", "keep:def valid_age(age):"], hints: ["Use >= and <= so 11 and 18 both count.", "`return age >= 11 and age <= 18` works."] },
      { id: "filltri", title: "Finish: triangle area", level: 2, brief: "The input and output are done. Finish the function `area_of_triangle(base, height)` so it returns base × height ÷ 2.",
        starter: `def area_of_triangle(base, height):
    # return the area of the triangle
    pass

b = float(input("Base: "))
h = float(input("Height: "))
print("Area:", area_of_triangle(b, h))
`, tests: [T(["6", "3"], { nums: [9] }), F("area_of_triangle(10, 4)", "20", 0, { i: ["1", "1"] }), F("area_of_triangle(5, 5)", "12.5", 1, { i: ["1", "1"] }), T(["7", "2"], { nums: [7] }, 1)],
        req: ["def:area_of_triangle", "return", "keep:def area_of_triangle(base, height):"], hints: ["The function must `return` the answer, not print it.", "Area = base * height / 2"] },
      { id: "fillmenu", title: "Finish: calculator menu", level: 2, brief: "The menu and option 1 are done. Add an `elif` so choice `2` prints a − b, and an `else` that prints `Invalid choice`.",
        starter: `print("1. Add")
print("2. Subtract")
choice = input("Choice: ")
a = int(input("First number: "))
b = int(input("Second number: "))
if choice == "1":
    print("Answer:", a + b)
# add an elif for choice "2" here
# add an else here
`, tests: [T(["1", "5", "3"], { nums: [8] }), T(["2", "9", "4"], { nums: [5] }), T(["2", "3", "10"], { nums: [-7] }, 1), T(["7", "1", "1"], { has: ["invalid"] }, 1)],
        req: ['keep:if choice == "1":', "if"], hints: ["`choice` is a string, so compare it with \"2\" in quotes.", "`else:` needs no condition."] },
      { id: "fillshop", title: "Finish: shopping list", level: 2, brief: "Items are read until the user types `done`. Finish the program so each item is added to `shopping`, then print how many items are on the list.",
        starter: `shopping = []
item = input("Item (or done): ")
while item != "done":
    # 1. add item to the shopping list

    item = input("Item (or done): ")
# 2. print how many items are in the list
`, tests: [T(["milk", "eggs", "bread", "done"], { nums: [3], used: 4 }), T(["done"], { nums: [0], used: 1 }), T(["a", "b", "done"], { nums: [2], used: 3 }, 1)],
        req: ['keep:while item != "done":', "list"], hints: ["`shopping.append(item)` adds to the list.", "`len(shopping)` gives how many items it holds."] },
      { id: "fillsearch", title: "Finish: linear search", level: 2, brief: "Finish `find(items, target)` so it returns the position of `target` in the list, or `-1` if it isn't there.",
        starter: `def find(items, target):
    for i in range(len(items)):
        # if items[i] is the target, return i
        pass
    # the target wasn't found
    return -1
`, tests: [F("find([3, 8, 1], 8)", "1"), F("find([3, 8, 1], 5)", "-1"), F("find([], 1)", "-1", 1), F('find(["x", "y", "x"], "x")', "0", 1)],
        req: ["keep:for i in range(len(items)):", "keep:return -1", "no:index"], hints: ["Compare `items[i]` with `target` using ==.", "Return `i` straight away when they match."] },
      { id: "fillbubble", title: "Finish: bubble sort", level: 3, brief: "The loops of this bubble sort are written. Finish the inside of the inner loop so neighbouring items are swapped when they're in the wrong order.",
        starter: `def bubble_sort(items):
    items = items[:]
    n = len(items)
    for p in range(n - 1):
        for i in range(n - 1 - p):
            # swap items[i] and items[i + 1] if they are in the wrong order
            pass
    return items
`, tests: [F("bubble_sort([4, 2, 3, 1])", "[1, 2, 3, 4]"), F("bubble_sort([1, 2])", "[1, 2]"), F("bubble_sort([5, -1, 5, 0])", "[-1, 0, 5, 5]", 1), F("bubble_sort([])", "[]", 1)],
        req: ["keep:for i in range(n - 1 - p):", "no:sorted", "no:sort"], hints: ["Only swap when `items[i] > items[i + 1]`.", "Python can swap two values in one line: `a, b = b, a`."] },
      { id: "fillfile", title: "Finish: add to a file", level: 3, brief: "The program asks for a new name and counts the lines in `names.txt`. Finish it by writing the new name to the file, on its own line, before the count happens.",
        starter: `name = input("New name: ")
file = open("names.txt", "a")
# write the new name to the file, followed by a new line

file.close()

file = open("names.txt", "r")
count = 0
for line in file:
    count = count + 1
file.close()
print("There are now", count, "names")
`, tests: [{ i: ["Cal"], files: { "names.txt": "Ava\nBen\n" }, o: { nums: [3] }, h: false }, { i: ["Mo"], files: { "names.txt": "Zed\n" }, o: { nums: [2] }, h: true }, { i: ["Xi"], files: { "names.txt": "" }, o: { nums: [1] }, h: true }],
        req: ['keep:file = open("names.txt", "a")', "file"], hints: ["`file.write(...)` writes text to the file.", "Add \"\\n\" after the name so the next name starts on a new line."] }
    ] },
    { id: "debug", title: "Debugging", kind: "debug", items: [
      { id: "dbeven", title: "Debug: odd or even", level: 1, brief: "This program should print `Even` for even numbers and `Odd` for odd numbers, but it gets them the wrong way round. Fix it.",
        starter: `number = int(input("Number: "))
if number % 2 == 1:
    print("Even")
else:
    print("Odd")
`, tests: [T(["4"], { words: ["even"], not: ["odd"] }), T(["7"], { words: ["odd"], not: ["even"] }), T(["0"], { words: ["even"], not: ["odd"] }, 1), T(["-3"], { words: ["odd"], not: ["even"] }, 1)], req: ["if"],
        hints: ["Run it with 4. What does it print?", "An even number leaves a remainder of 0 when divided by 2."] },
      { id: "dbsyntax", title: "Debug: syntax errors", level: 1, brief: "This greeting program won't run at all. There are two syntax errors. Use the error messages to find and fix them.",
        starter: `name = input("Name: ")
if name == "Ada"
    print("Hello, Ada! Welcome back.")
else:
    print("Hello, " + name
`, tests: [T(["Ada"], { has: ["hello", "ada"] }), T(["Sam"], { has: ["hello", "sam"] }), T(["Bo"], { has: ["hello", "bo"] }, 1)], req: [],
        hints: ["Every `if` and `else` line must end with a colon.", "Count the brackets on the last line."] },
      { id: "dbtypes", title: "Debug: type errors", level: 1, brief: "This program should say how old the user will be next year, but it crashes. Fix the type errors.",
        starter: `age = input("How old are you? ")
next_year = age + 1
print("Next year you will be " + next_year)
`, tests: [T(["14"], { nums: [15] }), T(["30"], { nums: [31] }, 1), T(["0"], { nums: [1] }, 1)], req: [],
        hints: ["`input()` always gives back a string.", "Use `int()` to do maths and `str()` to join a number onto text."] },
      { id: "dbtotal", title: "Debug: add up to n", level: 1, brief: "This should print the total of 1 + 2 + … + n, but the answers are wrong. There are two bugs.",
        starter: `n = int(input("n: "))
total = 0
for i in range(1, n):
    total = i
print("Total:", total)
`, tests: [T(["5"], { nums: [15] }), T(["10"], { nums: [55] }), T(["1"], { nums: [1] }, 1), T(["100"], { nums: [5050] }, 1)], req: ["loop", "no:sum"],
        hints: ["`range(1, n)` stops before n.", "`total = i` replaces the total instead of adding to it."] },
      { id: "dbgrade", title: "Debug: grade boundaries", level: 2, brief: "A should be 70 or more, B 60–69, C 50–59, otherwise U. Some scores get the wrong grade. Find the boundary bugs.",
        starter: `score = int(input("Score: "))
if score > 70:
    print("Grade A")
elif score > 60:
    print("Grade B")
elif score >= 50:
    print("Grade C")
else:
    print("Grade U")
`, tests: [T(["70"], { words: ["A"], not: ["B", "C", "U"], cs: true }), T(["60"], { words: ["B"], not: ["A", "C", "U"], cs: true }), T(["85"], { words: ["A"], not: ["B", "C", "U"], cs: true }),
          T(["69"], { words: ["B"], not: ["A", "C", "U"], cs: true }, 1), T(["50"], { words: ["C"], not: ["A", "B", "U"], cs: true }, 1), T(["49"], { words: ["U"], not: ["A", "B", "C"], cs: true }, 1)], req: ["if"],
        hints: ["Test with exactly 70. Which grade do you get?", "`>` and `>=` behave differently on the boundary."] },
      { id: "dbloop", title: "Debug: the endless countdown", level: 2, brief: "This countdown never finishes. Fix it so it counts down to 1 and then prints `Lift off!`",
        starter: `count = int(input("Count down from: "))
while count > 0:
    print(count)
print("Lift off!")
`, tests: [T(["3"], { nums: [3, 2, 1], has: ["lift off"] }), T(["5"], { nums: [5, 4, 3, 2, 1], has: ["lift off"] }, 1)], req: ["while"],
        hints: ["What stops a while loop? Something in the condition has to change.", "Take 1 off `count` inside the loop."] },
      { id: "dbmax", title: "Debug: largest in a list", level: 2, brief: "`largest(numbers)` works for most lists but gives the wrong answer for some. Work out which lists break it and fix it. Don't use `max()`.",
        starter: `def largest(numbers):
    biggest = 0
    for n in numbers:
        if n > biggest:
            biggest = n
    return biggest
`, tests: [F("largest([3, 9, 2])", "9"), F("largest([-5, -2, -9])", "-2"), F("largest([-1])", "-1", 1), F("largest([7, 7])", "7", 1)], req: ["def:largest", "no:max"],
        hints: ["Try a list where every number is negative.", "Start `biggest` at the first item in the list instead of 0."] },
      { id: "dbindex", title: "Debug: search crash", level: 3, brief: "`contains(items, target)` should return `True` if the target is in the list and `False` if not. It crashes when the target is missing. Fix it.",
        starter: `def contains(items, target):
    i = 0
    while i <= len(items):
        if items[i] == target:
            return True
        i = i + 1
    return False
`, tests: [F("contains([1, 2, 3], 2)", "True"), F("contains([1, 2, 3], 5)", "False"), F("contains([], 1)", "False", 1), F('contains(["a"], "a")', "True", 1)], req: ["def:contains"],
        hints: ["The last position in a list is `len(items) - 1`.", "Read the IndexError message: which line and why?"] },
      { id: "dbbinary", title: "Debug: binary search", level: 3, brief: "This binary search sometimes misses items and sometimes never finishes. Fix it so it returns the index of `target`, or `-1` if it isn't in the sorted list.",
        starter: `def binary_search(items, target):
    low = 0
    high = len(items)
    while low < high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid
        else:
            high = mid - 1
    return -1
`, tests: [F("binary_search([2, 5, 8, 12, 16, 23], 12)", "3"), F("binary_search([2, 5, 8, 12, 16, 23], 2)", "0"), F("binary_search([2, 5, 8, 12, 16, 23], 23)", "5", 1), F("binary_search([2, 5, 8, 12, 16, 23], 7)", "-1", 1), F("binary_search([], 1)", "-1", 1)],
        req: ["def:binary_search", "while", "no:index"], hints: ["If `low = mid`, can the range ever get smaller?", "`high` should be the last valid index, and the loop should run while `low <= high`."] }
    ] },
    { id: "adv", title: "Advanced", items: [
      { id: "advrle", title: "Run-length encoding", level: 3, brief: "Ask for some text and print it run-length encoded: each run of the same character becomes its count followed by the character, e.g. `AAABBC` → `3A2B1C`.",
        starter: `text = input("Text: ")
`, tests: [T(["AAABBC"], { words: ["3A2B1C"], cs: true }), T(["WWWWBWW"], { words: ["4W1B2W"], cs: true }), T(["Z"], { words: ["1Z"], cs: true }, 1), T(["ABAB"], { words: ["1A1B1A1B"], cs: true }, 1)], req: ["loop"],
        hints: ["Count how many times the current character repeats before it changes.", "Build the answer as a string: `out += str(count) + ch`."] },
      { id: "advgrid", title: "Times-table grid", level: 3, brief: "Ask for n and print an n × n multiplication grid, one row per line with numbers separated by spaces, e.g. for 3: `1 2 3`, `2 4 6`, `3 6 9`.",
        starter: `n = int(input("Size: "))
`, tests: [T(["3"], { lines: ["1 2 3", "2 4 6", "3 6 9"] }), T(["1"], { lines: ["1"] }, 1), T(["4"], { lines: ["1 2 3 4", "2 4 6 8", "3 6 9 12", "4 8 12 16"] }, 1)], req: ["loop"],
        hints: ["Use one loop for the rows and another loop inside it for the columns.", "`print(a, b, c)` puts spaces between values; `\" \".join(list)` does too."] },
      { id: "advanagram", title: "Anagram checker", level: 3, brief: "Write `is_anagram(a, b)` that returns `True` if the two phrases use exactly the same letters, ignoring capitals and spaces.",
        starter: `def is_anagram(a, b):
    pass
`, tests: [F('is_anagram("listen", "silent")', "True"), F('is_anagram("hello", "world")', "False"), F('is_anagram("Dormitory", "Dirty room")', "True", 1), F('is_anagram("aab", "abb")', "False", 1), F('is_anagram("", "")', "True", 1)],
        req: ["def:is_anagram", "return"], hints: ["Remove spaces and make everything lower case first.", "Two words are anagrams if their sorted letters are the same."] },
      { id: "advprimes", title: "Primes up to n", level: 3, brief: "Ask for a number n and print every prime number from 2 up to n (inclusive).",
        starter: `n = int(input("Up to: "))
`, tests: [T(["20"], { nums: [2, 3, 5, 7, 11, 13, 17, 19], mode: "subseq", slack: 2 }), T(["10"], { nums: [2, 3, 5, 7], mode: "subseq", slack: 2 }), T(["2"], { nums: [2], mode: "subseq", slack: 2 }, 1), T(["30"], { nums: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29], mode: "subseq", slack: 2 }, 1)], req: ["loop"],
        hints: ["Check each number from 2 to n in turn.", "A number is prime if nothing from 2 up to its square root divides it exactly."] },
      { id: "advhex", title: "Denary to hex", level: 3, brief: "Write `to_hex(n)` that returns n (0 or more) as a hexadecimal string in capitals, e.g. `255` → `\"FF\"`. Don't use `hex()` or `format()`.",
        starter: `def to_hex(n):
    digits = "0123456789ABCDEF"
`, tests: [F("to_hex(255)", '"FF"'), F("to_hex(16)", '"10"'), F("to_hex(0)", '"0"', 1), F("to_hex(171)", '"AB"', 1), F("to_hex(4096)", '"1000"', 1)], req: ["def:to_hex", "loop", "no:hex", "no:format"],
        hints: ["`n % 16` gives the last hex digit; `n // 16` moves to the next.", "Don't forget the special case of 0."] },
      { id: "advmerge", title: "Merge sorted lists", level: 3, brief: "Write `merge(a, b)` that takes two lists already in ascending order and returns one list with every item in ascending order. Don't use `sorted()` or `.sort()`: this is the merge step of merge sort.",
        starter: `def merge(a, b):
    result = []
    i = 0
    j = 0
`, tests: [F("merge([1, 4, 9], [2, 3, 10])", "[1, 2, 3, 4, 9, 10]"), F("merge([], [1, 2])", "[1, 2]"), F("merge([5], [])", "[5]", 1), F("merge([1, 1], [1])", "[1, 1, 1]", 1)], req: ["def:merge", "loop", "no:sorted", "no:sort"],
        hints: ["Compare the front item of each list and take the smaller one.", "When one list runs out, add everything left in the other."] },
      { id: "advwords", title: "Most common word", level: 3, brief: "Write `most_common_word(sentence)` that returns the word used most often, in lower case. If there's a tie, return the one that appears first.",
        starter: `def most_common_word(sentence):
    counts = {}
`, tests: [F('most_common_word("the cat and the hat")', '"the"'), F('most_common_word("Red blue RED green")', '"red"'), F('most_common_word("one two")', '"one"', 1), F('most_common_word("b a a b b")', '"b"', 1)],
        req: ["def:most_common_word", "return"], hints: ["A dictionary can count each word: `counts[w] = counts.get(w, 0) + 1`.", "Loop through the words in order so ties go to the earliest."] },
      { id: "advstrength", title: "Password strength", level: 3, brief: "Write `strength(p)` that scores a password on four rules: at least 8 characters, contains a digit, contains a capital letter, contains a symbol (not a letter or digit). Return `\"weak\"` for 0–1 rules, `\"medium\"` for 2–3 and `\"strong\"` for all 4.",
        starter: `def strength(p):
    score = 0
`, tests: [F('strength("abc")', '"weak"', 0, { cs: false }), F('strength("abcdefgh1")', '"medium"', 0, { cs: false }), F('strength("Abcdefg1!")', '"strong"', 0, { cs: false }), F('strength("ABC!")', '"medium"', 1, { cs: false }), F('strength("password")', '"weak"', 1, { cs: false }), F('strength("P4ss!")', '"medium"', 1, { cs: false })],
        req: ["def:strength", "return"], hints: ["Add 1 to `score` for each rule the password meets.", "`c.isdigit()`, `c.isupper()` and `c.isalnum()` test single characters."] },
      { id: "advdigits", title: "Recursive digit sum", level: 3, brief: "Write `digit_sum(n)` that returns the sum of the digits of n (e.g. 1234 → 10) using recursion: the function must call itself.",
        starter: `def digit_sum(n):
    pass
`, tests: [F("digit_sum(1234)", "10"), F("digit_sum(9)", "9"), F("digit_sum(0)", "0", 1), F("digit_sum(99999)", "45", 1), F("digit_sum(1000)", "1", 1)], req: ["def:digit_sum", "recursive:digit_sum"],
        hints: ["Base case: a single digit is its own sum.", "`n % 10` is the last digit and `n // 10` is the rest."] }
    ] }
  ]
};
BW.CODE.all = BW.CODE.sections.flatMap(s => s.items.map(c => ({ ...c, kind: c.kind || s.kind || null, section: s })));
BW.findChallenge = id => BW.CODE.all.find(c => c.id === id);
})();

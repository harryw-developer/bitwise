BW.units.push({
  id: "alg", title: "Algorithms", paper: 2, c1: "#F15BB5", c2: "#FEE440", motif: "bars",
  blurb: "Computational thinking, designing algorithms with flowcharts and pseudocode, tracing them, and the standard searching and sorting algorithms you must be able to run by hand.",
  subs: [
    { id: "ct", title: "Computational Thinking", motif: "nodes",
      notes: ["Abstraction: removing unnecessary detail to focus on what matters (e.g. a tube map).", "Decomposition: breaking a problem into smaller, more manageable sub-problems.", "Algorithmic thinking: working out the ordered steps needed to solve a problem.", "Inputs, processes and outputs: identify what goes in, what happens, and what comes out."],
      bank: [
        [1, "What is abstraction?", "Removing unnecessary detail from a problem", ["Breaking a problem into smaller parts", "Writing code in steps", "Testing a program"], "Keep only what matters."],
        [1, "What is decomposition?", "Breaking a problem down into smaller sub-problems", ["Removing detail", "Deleting code", "Compressing data"], "Smaller parts are easier to solve."],
        [2, "A tube map leaves out real distances and streets. This is an example of…", "Abstraction", ["Decomposition", "Iteration", "Validation"], "Only stations and connections remain."],
        [2, "Splitting a game into 'menu', 'player movement' and 'scoring' is…", "Decomposition", ["Abstraction", "Encryption", "Compilation"], "Separate, manageable parts."],
        [2, "What is algorithmic thinking?", "Identifying the steps needed to solve a problem", ["Guessing the answer", "Drawing the user interface", "Buying better hardware"], "A precise sequence of steps."],
        [3, "Why does decomposition help teams of programmers?", "Different people can work on different parts at once", ["It removes the need for testing", "It makes the program run faster", "It hides detail from users"], "Parallel development and easier testing."],
        [3, "A weather app shows 'Sunny, 21°C' rather than raw sensor data. Which technique is this?", "Abstraction", ["Decomposition", "Casting", "Iteration"], "Detail hidden, key info shown."],
        [2, "In a program that calculates a total bill, which is an input?", "The prices of the items", ["The printed receipt", "The addition of prices", "The final total"], "Data going in."]
      ] },
    { id: "design", title: "Flowcharts, Pseudocode & Trace Tables", motif: "brackets", gen: ["traceLoop"],
      notes: ["Flowchart symbols: terminal (rounded rectangle) for start/stop; parallelogram for input/output; rectangle for process; diamond for decision; rectangle with side bars for subroutine.", "Pseudocode describes an algorithm in structured English without strict syntax.", "A trace table records the value of each variable as each line runs — used to find logic errors and work out outputs."],
      bank: [
        [1, "Which flowchart symbol is used for a decision?", "Diamond", ["Rectangle", "Parallelogram", "Oval"], "Decisions have Yes/No exits."],
        [1, "Which flowchart symbol shows input or output?", "Parallelogram", ["Diamond", "Rectangle", "Circle"], "E.g. INPUT name, OUTPUT total."],
        [1, "Which symbol marks the start or end?", "Rounded rectangle (terminal)", ["Diamond", "Parallelogram", "Arrow"], "Terminator."],
        [2, "What is a trace table used for?", "Tracking variable values as an algorithm runs", ["Drawing flowcharts", "Compressing code", "Listing hardware"], "Great for finding logic errors."],
        [2, "What is pseudocode?", "A structured, language-independent way of writing an algorithm", ["A programming language", "Machine code", "Encrypted code"], "Not strict syntax."],
        [2, "Which flowchart symbol represents a process like `total = total + 1`?", "Rectangle", ["Diamond", "Parallelogram", "Oval"], "Processes are rectangles."],
        [3, "A flowchart box with double vertical lines at the sides means…", "A subroutine (predefined process)", ["A decision", "An input", "The end"], "Calls a separate procedure/function."]
      ] },
    { id: "searching", title: "Searching Algorithms", motif: "bars", gen: ["linearSearch", "binarySearch"],
      notes: ["Linear search: check each item in turn until found or the end is reached. Works on unsorted data; slow for large lists.", "Binary search: needs sorted data. Check the middle item; if it's not the target, discard the half it can't be in and repeat.", "Binary search is much faster on large sorted lists (halves the list each time)."],
      bank: [
        [1, "Which search algorithm requires the data to be sorted?", "Binary search", ["Linear search", "Both", "Neither"], "It relies on discarding half."],
        [1, "Linear search checks items…", "One by one from the start", ["From the middle outwards", "In random order", "Only the last item"], "Sequentially."],
        [2, "What is an advantage of linear search?", "It works on unsorted lists", ["It's always fastest", "It halves the list each time", "It needs no loop"], "Simple and works on any list."],
        [2, "In the worst case, how many items does binary search check in a sorted list of 1000?", "About 10", ["1000", "500", "100"], "2^10 = 1024, so about 10 halvings."],
        [2, "After checking the middle item of a sorted list and finding it's too small, binary search…", "Discards the left half including the middle", ["Discards the right half", "Starts again from the start", "Checks every remaining item"], "The target must be to the right."],
        [3, "A list of 1,000,000 unsorted items needs searching once. Which is quicker overall?", "Linear search — sorting first would take longer", ["Binary search without sorting", "Binary search after sorting", "Neither can search it"], "Sorting costs more than one linear pass."],
        [3, "In the worst case, linear search on n items makes how many comparisons?", "n", ["n ÷ 2", "log₂ n", "1"], "It may have to check every item."]
      ] },
    { id: "sorting", title: "Sorting Algorithms", motif: "bars", gen: ["bubblePass", "insertionPass"],
      notes: ["Bubble sort: repeatedly compare adjacent pairs and swap if in the wrong order. After each pass the largest unsorted item is in place. Stop when a pass makes no swaps. Simple but slow.", "Insertion sort: take each item in turn and insert it into the correct place in the sorted part at the start of the list. Efficient on small or nearly sorted lists.", "Merge sort: split the list in half repeatedly until each list has 1 item, then merge pairs back together in order. Much faster on large lists but uses more memory."],
      bank: [
        [1, "Which sort repeatedly swaps adjacent items that are out of order?", "Bubble sort", ["Merge sort", "Insertion sort", "Binary sort"], "Items 'bubble' to the end."],
        [1, "Which sort splits the list into single items and then merges them?", "Merge sort", ["Bubble sort", "Insertion sort", "Linear sort"], "Divide and conquer."],
        [2, "How does bubble sort know the list is sorted?", "A full pass is made with no swaps", ["After exactly one pass", "When the middle item is found", "After n² passes always"], "No swaps = in order."],
        [2, "Which sort is usually fastest on very large lists?", "Merge sort", ["Bubble sort", "Insertion sort", "They're equal"], "Much better scaling."],
        [2, "A disadvantage of merge sort is…", "It uses more memory", ["It's always slow", "It only works on 8 items", "It can't sort numbers"], "It creates extra lists while splitting."],
        [2, "Insertion sort builds a sorted section…", "At the start of the list, one item at a time", ["At the end, largest first", "By splitting in half", "Randomly"], "Each item is inserted into place."],
        [3, "When is insertion sort a good choice?", "The list is small or already nearly sorted", ["The list has millions of random items", "The list can't be changed", "Only when sorting text"], "Few moves needed."],
        [3, "Merge sort on [8, 3, 5, 1]: what are the lists after the first merge step?", "[3, 8] and [1, 5]", ["[1, 3, 5, 8]", "[8, 3] and [5, 1]", "[3, 5] and [8, 1]"], "Split to single items, then merge pairs in order."]
      ] }
  ]
});

BW.units.push({
  id: "prog", title: "Programming Fundamentals", paper: 2, c1: "#00BBF9", c2: "#9B5DE5", motif: "brackets",
  blurb: "Variables and constants, the three constructs, operators, data types, strings, arrays, files, SQL, subroutines and random numbers: everything behind the code questions in Paper 2.",
  subs: [
    { id: "vars", title: "Variables, Constants & I/O", motif: "brackets",
      notes: ["A variable is a named memory location whose value can change while the program runs.", "A constant is a named value that cannot change while the program runs (e.g. VAT = 0.2). Makes code easier to read and update.", "Assignment gives a variable a value: `score = 0`.", "Input takes data from the user; output displays it."],
      bank: [
        [1, "What is a variable?", "A named memory location whose value can change", ["A value that never changes", "A type of loop", "An error in code"], "Its value can vary."],
        [1, "What is a constant?", "A named value that can't change while the program runs", ["A variable inside a loop", "A random number", "An input from the user"], "Fixed during execution."],
        [1, "What does `x = 5` do?", "Assigns the value 5 to x", ["Checks if x equals 5", "Prints 5", "Deletes x"], "Single = is assignment."],
        [2, "Why use a constant for VAT rather than typing 0.2 everywhere?", "It only needs changing in one place and is easier to read", ["It makes the program run slower", "Constants use no memory", "It allows VAT to change during the program"], "Maintainability."],
        [2, "Which is a sensible variable name?", "totalScore", ["x1y2z3", "2ndScore", "total score"], "Meaningful, no spaces, doesn't start with a digit."],
        [3, "After `a = 3`, `b = a`, `a = 7`, what is b?", "3", ["7", "10", "a"], "b copied a's value when it was 3."],
        [3, "What is printed? `name = input()` then `print(\"Hi \" + name)` with input Sam.", "Hi Sam", ["Hi name", "Sam", "Hi + Sam"], "Concatenation joins the strings."]
      ] },
    { id: "constructs", title: "Sequence, Selection & Iteration", motif: "waves",
      notes: ["Sequence: instructions run in order.", "Selection: choosing a path using IF / ELSE IF / ELSE or SWITCH/CASE.", "Iteration: repeating code. Count-controlled (FOR) repeats a set number of times; condition-controlled (WHILE / DO…UNTIL) repeats until a condition changes.", "A WHILE loop checks its condition before running and may run 0 times; a DO…UNTIL runs at least once."],
      bank: [
        [1, "Which construct is used to make a decision?", "Selection", ["Sequence", "Iteration", "Assignment"], "IF statements."],
        [1, "Which construct repeats code?", "Iteration", ["Selection", "Sequence", "Casting"], "Loops."],
        [1, "Which loop is count-controlled?", "FOR", ["WHILE", "DO…UNTIL", "IF"], "Repeats a fixed number of times."],
        [2, "Which loop is best for 'keep asking until the password is correct'?", "A condition-controlled loop (WHILE)", ["A FOR loop from 1 to 3", "An IF statement", "No loop is needed"], "Unknown number of repetitions."],
        [2, "What's the difference between WHILE and DO…UNTIL?", "DO…UNTIL always runs at least once", ["WHILE always runs at least once", "They're identical", "DO…UNTIL can't use conditions"], "The condition is checked at the end."],
        [2, "How many times does `for i = 0 to 4` run (OCR style, inclusive)?", "5", ["4", "3", "6"], "0, 1, 2, 3, 4."],
        [3, "`for i = 1 to 10 step 3` produces which values of i?", "1, 4, 7, 10", ["1, 3, 6, 9", "3, 6, 9", "1, 4, 7"], "Start at 1, add 3 each time, up to 10 inclusive."],
        [3, "What is nesting?", "Putting one construct inside another, e.g. an IF inside a loop", ["Running code in sequence", "Declaring a constant", "Calling the OS"], "Structures within structures."]
      ] },
    { id: "operators", title: "Operators", motif: "grid", gen: ["arith"],
      notes: ["Arithmetic: + − * / plus MOD (remainder), DIV (whole-number division) and ^ (exponent).", "Comparison: == equal, != not equal, <, <=, >, >=.", "Boolean: AND, OR, NOT.", "Python uses % for MOD, // for DIV and ** for power."],
      bank: [
        [1, "Which operator checks if two values are equal?", "==", ["=", "!=", ">="], "= assigns; == compares."],
        [1, "What does `!=` mean?", "Not equal to", ["Equal to", "Greater than", "Factorial"], "Returns True if the values differ."],
        [2, "Which operator gives the remainder of a division?", "MOD", ["DIV", "^", "/"], "17 MOD 5 = 2."],
        [2, "What does `(5 > 3) AND (2 > 4)` evaluate to?", "False", ["True", "5", "Error"], "AND needs both to be True."],
        [2, "What does `NOT (3 == 3)` evaluate to?", "False", ["True", "3", "Error"], "3 == 3 is True; NOT flips it."],
        [3, "How can you test if a number n is even?", "`n MOD 2 == 0`", ["`n DIV 2 == 0`", "`n / 2 == 1`", "`n ^ 2 == 0`"], "Even numbers leave remainder 0."],
        [3, "Which Python operator does integer (DIV) division?", "//", ["/", "%", "**"], "7 // 2 = 3."]
      ] },
    { id: "types", title: "Data Types & Casting", motif: "brackets", gen: ["dataType"],
      notes: ["Integer: whole number. Real/float: number with a decimal part. Boolean: True/False. Character: a single character. String: a sequence of characters.", "Casting changes a value's data type, e.g. `int(\"42\")`, `str(7)`, `float(\"3.5\")`.", "Input is usually a string, so it often needs casting before doing maths."],
      bank: [
        [1, "Which data type holds True or False?", "Boolean", ["Integer", "String", "Real"], "Only two possible values."],
        [2, "What is casting?", "Converting a value from one data type to another", ["Printing a value", "Deleting a variable", "Sorting a list"], "e.g. str(5) → \"5\"."],
        [2, "What does `int(\"12\") + 3` give?", "15", ["\"123\"", "123", "Error"], "The string is cast to an integer first."],
        [2, "What does `\"12\" + \"3\"` give?", "\"123\"", ["15", "Error", "\"15\""], "Adding strings joins (concatenates) them."],
        [3, "Why should a phone number be stored as a string?", "It may start with 0 and you don't do maths with it", ["Strings use less memory than integers", "Integers can't be more than 5 digits", "Phone numbers are Boolean"], "A leading 0 would be lost as an integer."],
        [3, "Which data type best stores a price like £4.99?", "Real / float", ["Integer", "Boolean", "Character"], "It has a decimal part."]
      ] },
    { id: "strings", title: "String Manipulation", motif: "brackets", gen: ["strings"],
      notes: ["Length: `word.length` (OCR) / `len(word)` (Python).", "Substring: `word.substring(start, length)` (OCR) / slicing `word[start:end]` (Python). Indexes start at 0.", "Case: `.upper` / `.lower`.", "Concatenation joins strings with +.", "ASCII conversion: `ASC(\"A\")` = 65, `CHR(65)` = \"A\"."],
      bank: [
        [1, "What is concatenation?", "Joining strings together", ["Splitting a string", "Counting characters", "Changing case"], "\"Hello \" + \"World\"."],
        [2, "What does `\"hello\".upper` return?", "HELLO", ["Hello", "hello", "5"], "All letters to capitals."],
        [2, "What does `ASC(\"B\")` return?", "66", ["65", "B", "98"], "The ASCII code of B."],
        [3, "What does `CHR(ASC(\"a\") + 2)` return?", "c", ["b", "99", "a2"], "97 + 2 = 99 = \"c\"."]
      ] }
  ]
});

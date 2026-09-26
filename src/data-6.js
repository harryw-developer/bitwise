BW.units.find(u => u.id === "prog").subs.push(
  { id: "arrays", title: "Arrays", motif: "grid", gen: ["arrays"],
    notes: ["An array stores multiple values of the same data type under one identifier.", "Items are accessed by index, starting at 0.", "A 2D array is like a table: `grid[row][column]`.", "Arrays in exam pseudocode are usually fixed size (static)."],
    bank: [
      [1, "What is an array?", "A data structure holding multiple items under one name", ["A single variable", "A type of loop", "A function"], "One identifier, many elements."],
      [1, "In most languages, what is the index of the first item?", "0", ["1", "-1", "It varies each run"], "Zero-indexed."],
      [2, "Why use an array instead of 30 separate variables for student scores?", "It can be processed with a loop and is easier to manage", ["It uses no memory", "Arrays can only hold 30 items", "Variables can't store numbers"], "Loop over indexes."],
      [2, "An array has 8 elements. What is the index of the last one?", "7", ["8", "9", "0"], "Indexes 0–7."],
      [3, "How would you best store a noughts-and-crosses board?", "A 2D array (3 × 3)", ["A single string of length 1", "A Boolean", "Nine constants"], "Rows and columns."],
      [3, "What does `names[3] = \"Zara\"` do?", "Replaces the 4th item with \"Zara\"", ["Adds \"Zara\" 3 times", "Deletes item 3", "Prints the 3rd name"], "Index 3 is the 4th element."]
    ] },
  { id: "files", title: "File Handling", motif: "bars",
    notes: ["Open a file before using it: `f = open(\"scores.txt\")`.", "Read: `f.readLine()`; write: `f.writeLine(\"text\")`; `endOfFile()` checks if you've reached the end.", "Close the file when done: `f.close()` so changes are saved and the file is released.", "Files let data persist after the program ends."],
    bank: [
      [1, "Why do programs store data in files?", "So data is kept after the program closes", ["To make the program faster", "To avoid using variables", "Because RAM is non-volatile"], "Persistence."],
      [1, "What must you do before reading a file?", "Open it", ["Close it", "Delete it", "Compile it"], "Open → read/write → close."],
      [2, "Why should a file be closed after use?", "To save changes and release it for other programs", ["To delete its contents", "To encrypt it", "It is optional and does nothing"], "Unclosed files can lose data."],
      [2, "What is `endOfFile()` used for?", "Checking whether there are more lines to read", ["Deleting the last line", "Closing the file", "Creating a file"], "Used as a loop condition."],
      [3, "Which loop is best for reading every line of a file of unknown length?", "`while NOT file.endOfFile()`", ["`for i = 1 to 10`", "An IF statement", "`do … until i == 5`"], "Stop when the end is reached."],
      [3, "Opening a file in write mode that already exists usually…", "Overwrites its contents", ["Appends to the end", "Makes it read-only", "Deletes the program"], "Use append mode to add to the end."]
    ] },
  { id: "sql", title: "SQL", motif: "grid", gen: ["sqlRows"],
    notes: ["SQL (Structured Query Language) searches databases.", "`SELECT field(s) FROM table WHERE condition` — `*` selects all fields.", "Conditions can use =, <, >, <=, >=, <>, AND, OR, and LIKE with % as a wildcard.", "A record is a row; a field is a column."],
    bank: [
      [1, "What does SQL stand for?", "Structured Query Language", ["Simple Question Language", "Sorted Query List", "System Quality Language"], "Used to query databases."],
      [1, "Which keyword chooses the table to search?", "FROM", ["SELECT", "WHERE", "TABLE"], "SELECT … FROM table."],
      [1, "What does `SELECT *` mean?", "Return all fields", ["Return all tables", "Multiply the fields", "Return nothing"], "* is the wildcard for fields."],
      [2, "Which keyword filters records using a condition?", "WHERE", ["FROM", "ORDER", "SELECT"], "WHERE age > 15."],
      [2, "In a database table, what is a field?", "A single column / attribute", ["A whole row", "The whole table", "A query"], "e.g. 'surname'."],
      [2, "In a database table, what is a record?", "A single row about one item", ["A single column", "A whole database", "A primary key only"], "All data about one entity."],
      [3, "Which query finds names starting with 'J'?", "`SELECT name FROM Students WHERE name LIKE \"J%\"`", ["`SELECT name FROM Students WHERE name = \"J\"`", "`SELECT J FROM Students`", "`SELECT name WHERE J%`"], "% matches any characters."],
      [3, "What does a primary key do?", "Uniquely identifies each record", ["Encrypts the table", "Sorts records alphabetically", "Stores the password"], "No two records share it."]
    ] },
  { id: "subroutines", title: "Subroutines", motif: "brackets",
    notes: ["A subroutine is a named block of code that performs a task and can be called when needed.", "A function returns a value; a procedure does not.", "Parameters pass data into a subroutine.", "Local variables exist only inside the subroutine; global variables can be used anywhere.", "Benefits: reuse, easier testing and maintenance, teams can work on separate parts."],
    bank: [
      [1, "What is the difference between a function and a procedure?", "A function returns a value; a procedure doesn't", ["A procedure returns a value; a function doesn't", "They're identical", "Functions can't take parameters"], "Return value is the key difference."],
      [1, "What is a parameter?", "A value passed into a subroutine", ["A loop counter", "A global constant", "An error message"], "Inputs to the subroutine."],
      [2, "What is a local variable?", "A variable that only exists inside the subroutine it is declared in", ["A variable available everywhere", "A constant", "A variable in a file"], "Scope is limited."],
      [2, "Give a benefit of using subroutines.", "Code can be reused without rewriting it", ["They make programs longer", "They stop all errors", "They remove the need for variables"], "Write once, call many times."],
      [2, "Why are local variables considered good practice?", "They can't be accidentally changed by other parts of the program", ["They use more memory", "They last forever", "They're faster to type"], "Fewer side-effects."],
      [3, "`function double(n)` `return n * 2` `endfunction`. What does `print(double(double(3)))` output?", "12", ["6", "9", "3"], "double(3) = 6, double(6) = 12."],
      [3, "Which is a built-in function in most languages?", "`len()` / `.length`", ["`double()`", "`calculateVAT()`", "`showMenu()`"], "Provided by the language."]
    ] },
  { id: "random", title: "Random Numbers", motif: "bits",
    notes: ["Random numbers are used in games, simulations and testing.", "OCR: `random(1, 6)` returns a random integer from 1 to 6 inclusive.", "Python: `import random` then `random.randint(1, 6)`."],
    bank: [
      [1, "What could `random(1, 6)` be used to simulate?", "Rolling a dice", ["Tossing two coins", "Choosing a letter", "Reading a file"], "Returns 1–6."],
      [2, "Which values can `random(1, 10)` return (OCR style)?", "Any whole number from 1 to 10 inclusive", ["1 to 9 only", "0 to 10", "Only 1 or 10"], "Both ends are inclusive."],
      [2, "In Python, what must you do before using `randint`?", "`import random`", ["Declare a constant", "Open a file", "Nothing"], "It's in the random module."],
      [3, "Which expression simulates a coin toss giving 0 or 1?", "`random(0, 1)`", ["`random(1, 2) * 0`", "`random(0, 2)`", "`random(1, 1)`"], "Two possible outcomes."],
      [1, "Why might a game use random numbers?", "To make events unpredictable, like where an enemy appears", ["To make the game load faster", "To save the player's score", "To stop the game crashing"], "Randomness keeps each play different."],
      [1, "Which Python line picks a random whole number from 1 to 100?", "`random.randint(1, 100)`", ["`random(100)`", "`randint.random(1, 100)`", "`random.int(1, 100)`"], "randint(a, b) includes both a and b."],
      [2, "`x = random(1, 6) + random(1, 6)`. What is the smallest possible value of x?", "2", ["1", "0", "6"], "Each dice gives at least 1, so 1 + 1 = 2."],
      [2, "`x = random(1, 6) + random(1, 6)`. What is the largest possible value of x?", "12", ["6", "11", "36"], "Each dice gives at most 6, so 6 + 6 = 12."],
      [3, "Why are random numbers useful when testing a program?", "They can generate lots of varied test data quickly", ["They guarantee every bug is found", "They make the program run faster", "They replace boundary testing"], "Random data covers many cases, but you still need boundary tests."],
      [3, "Which expression gives a random even number from 2 to 20 (OCR style)?", "`random(1, 10) * 2`", ["`random(2, 20)`", "`random(1, 20) * 2`", "`random(2, 20) / 2`"], "1 to 10 doubled gives 2, 4, … 20."]
    ] }
);

BW.units.push({
  id: "robust", title: "Producing Robust Programs", paper: 2, c1: "#FB5607", c2: "#FFBE0B", motif: "shield",
  blurb: "Defensive design, validation and authentication, writing maintainable code, and how to test properly with the right kinds of test data.",
  subs: [
    { id: "defensive", title: "Defensive Design & Validation", motif: "shield",
      notes: ["Defensive design anticipates misuse so programs don't crash or get exploited.", "Input validation checks data is sensible: range check, type check, length check, presence check, format check.", "Authentication confirms a user's identity (usernames/passwords, 2FA).", "Validation can't check data is correct — only that it's reasonable. Verification (e.g. typing a password twice) checks it was entered correctly."],
      bank: [
        [1, "What is input validation?", "Checking that input data is sensible before using it", ["Encrypting the input", "Making input faster", "Deleting wrong input"], "Reject unreasonable data."],
        [1, "Which check makes sure a field isn't left empty?", "Presence check", ["Range check", "Length check", "Type check"], "Something must be entered."],
        [1, "Which check ensures an age is between 0 and 120?", "Range check", ["Presence check", "Format check", "Type check"], "Within limits."],
        [2, "Which check ensures a postcode matches a pattern like 'AA9 9AA'?", "Format check", ["Range check", "Presence check", "Type check"], "Matches a pattern."],
        [2, "Which check ensures a password is at least 8 characters?", "Length check", ["Range check", "Type check", "Presence check"], "Counts characters."],
        [2, "What is authentication?", "Confirming a user is who they claim to be", ["Checking input is sensible", "Compressing data", "Commenting code"], "Logins, passwords, biometrics."],
        [3, "Why can't validation guarantee data is correct?", "Data can be sensible but still wrong, e.g. a mistyped but valid date", ["Validation deletes data", "Validation only works on numbers", "It encrypts the data"], "Reasonable ≠ correct."],
        [3, "Typing a new password twice is an example of…", "Verification", ["Validation", "Casting", "Abstraction"], "Checks it was entered accurately."],
        [3, "How does defensive design protect against SQL injection?", "By validating and sanitising user input", ["By adding more RAM", "By using a faster CPU", "By removing all comments"], "Don't trust input."]
      ] },
    { id: "maintain", title: "Maintainability", motif: "brackets",
      notes: ["Use subroutines to structure code.", "Use meaningful variable and subroutine names.", "Use indentation to show structure.", "Use comments to explain what code does.", "Maintainable code is easier for others (and you, later) to understand, fix and update."],
      bank: [
        [1, "Why add comments to code?", "To explain what the code does to other programmers", ["To make it run faster", "The computer needs them", "To hide the code"], "Comments are ignored by the translator."],
        [1, "Which improves maintainability?", "Meaningful variable names", ["Single-letter names everywhere", "No indentation", "One giant subroutine"], "e.g. totalCost not tc."],
        [2, "Why is indentation useful?", "It shows the structure of loops and selection", ["It speeds up the program", "It encrypts code", "It's required for all languages to compile"], "Readability (and required in Python)."],
        [2, "Why is maintainability important?", "Code is easier to fix and update in future", ["The program uses less RAM", "Users see the comments", "It stops hacking"], "Other programmers can understand it."],
        [3, "Which is the most maintainable?", "`for student in students: total = total + student.score`", ["`for s in x: t=t+s.q`", "`for a in b: c=c+a.d`", "Everything on one line with no names"], "Clear names explain intent."]
      ] },
    { id: "testing", title: "Testing & Test Data", motif: "bars", gen: ["testData"],
      notes: ["Iterative testing: testing each part while developing. Final (terminal) testing: testing the whole program at the end.", "Normal data: valid, typical data. Boundary data: at the edge of the valid range (and just outside, depending on the spec). Invalid data: correct type but outside the range. Erroneous data: wrong data type.", "A test plan lists test data, expected result and actual result."],
      bank: [
        [1, "Why do we test programs?", "To find errors and check it meets requirements", ["To make it longer", "To add comments", "To compress it"], "Make sure it works as intended."],
        [2, "What is iterative testing?", "Testing each module during development", ["Testing only at the very end", "Testing by users only", "Never testing"], "Test as you build."],
        [2, "What is final (terminal) testing?", "Testing the whole program once it's complete", ["Testing each line as it is typed", "Deleting old tests", "Testing hardware"], "End-of-development check."],
        [2, "What should a test plan include?", "Test data, expected result and actual result", ["The source code only", "The user's password", "The CPU model"], "Compare expected vs actual."],
        [3, "An age field accepts 11–18. Which is erroneous test data?", "\"eleven\"", ["11", "19", "15"], "Wrong data type."],
        [3, "Why test with boundary data?", "Errors often occur at the edges of ranges (e.g. < vs <=)", ["It's the most common input", "It's faster to type", "It always crashes"], "Off-by-one mistakes."]
      ] },
    { id: "errors", title: "Syntax & Logic Errors", motif: "brackets",
      notes: ["Syntax error: breaks the rules of the language, so it won't compile/run (e.g. missing bracket, misspelt keyword).", "Logic error: the program runs but gives the wrong result (e.g. using > instead of >=).", "Runtime errors (e.g. dividing by zero) crash a running program."],
      bank: [
        [1, "A missing closing bracket is a…", "Syntax error", ["Logic error", "Runtime error", "Hardware error"], "Breaks the language rules."],
        [1, "A program runs but calculates the wrong average. This is a…", "Logic error", ["Syntax error", "Compilation error", "Network error"], "Runs, wrong output."],
        [2, "Which is a syntax error?", "`pritn(\"Hello\")`", ["`total = a - b` when it should be a + b", "`if age > 18` when it should be >=", "Looping one time too many"], "Misspelt keyword."],
        [2, "Why are logic errors harder to find than syntax errors?", "The program still runs, so the translator doesn't flag them", ["They only happen on Tuesdays", "They're always in comments", "They stop the computer booting"], "Need testing to spot them."],
        [3, "`if score > 50 then print(\"Pass\")` should pass 50 too. What error is this?", "Logic error — should be >=", ["Syntax error — missing bracket", "Runtime error", "No error"], "Boundary logic mistake."],
        [3, "Which tool helps find a logic error?", "A trace table or breakpoints", ["A syntax highlighter only", "A bigger monitor", "Defragmentation"], "Step through and watch values."]
      ] }
  ]
});

BW.units.push({
  id: "logic", title: "Boolean Logic", paper: 2, c1: "#14213D", c2: "#22C55E", motif: "gates",
  blurb: "AND, OR and NOT gates, their symbols and truth tables, and combining them into logic diagrams and expressions with up to three inputs.",
  subs: [
    { id: "gates", title: "Logic Gates", motif: "gates",
      notes: ["AND: output 1 only if both inputs are 1. Symbol: D-shape.", "OR: output 1 if at least one input is 1. Symbol: curved shield shape.", "NOT: output is the opposite of the input. Symbol: triangle with a small circle.", "Computers use logic gates made from transistors to process binary."],
      bank: [
        [1, "An AND gate outputs 1 when…", "Both inputs are 1", ["Either input is 1", "Both inputs are 0", "The input is 0"], "All must be true."],
        [1, "An OR gate outputs 1 when…", "At least one input is 1", ["Both inputs are 0", "Only both are 1", "Never"], "Any true input."],
        [1, "What does a NOT gate do?", "Reverses the input", ["Adds two inputs", "Always outputs 1", "Needs two inputs"], "0→1, 1→0."],
        [2, "Which gate's symbol is a triangle with a small circle?", "NOT", ["AND", "OR", "XOR"], "The bubble means inversion."],
        [2, "Which gate's symbol has a flat back and a round front, like a D?", "AND", ["OR", "NOT", "NAND"], "D for anD."],
        [2, "How many inputs does a NOT gate have?", "1", ["2", "3", "0"], "It inverts a single input."],
        [3, "How many rows does a truth table with 3 inputs have?", "8", ["6", "3", "9"], "2^3 = 8."],
        [3, "A car alarm sounds if the door is opened OR the window is broken, AND the alarm is set. Which expression fits?", "(D OR W) AND S", ["D OR (W AND S)", "D AND W AND S", "NOT (D OR W)"], "Either trigger, but only when set."]
      ] },
    { id: "tables", title: "Truth Tables", motif: "grid", gen: ["truthTable"],
      notes: ["A truth table lists every combination of inputs and the resulting output.", "With n inputs there are 2^n rows: 2 inputs → 4 rows, 3 inputs → 8 rows.", "Work out intermediate columns (e.g. A AND B) before the final output."],
      bank: [
        [1, "How many rows does a 2-input truth table have?", "4", ["2", "3", "8"], "2^2 = 4."],
        [2, "In the AND truth table, how many rows output 1?", "1", ["2", "3", "0"], "Only 1,1."],
        [2, "In the OR truth table, how many rows output 1?", "3", ["1", "2", "4"], "All except 0,0."]
      ] },
    { id: "expressions", title: "Logic Expressions & Diagrams", motif: "gates", gen: ["logicEval"],
      notes: ["Expressions can be written with words (A AND B) or symbols: ∧ AND, ∨ OR, ¬ NOT.", "Brackets are evaluated first.", "A logic diagram connects gates: the output of one feeds into the input of another."],
      bank: [
        [1, "What symbol is used for AND?", "∧", ["∨", "¬", "+"], "∧ looks like an A for And."],
        [1, "What symbol is used for NOT?", "¬", ["∧", "∨", "!="], "¬A = NOT A."],
        [2, "What symbol is used for OR?", "∨", ["∧", "¬", "&"], "∨ is OR."],
        [3, "`¬(A ∧ B)` is equivalent to…", "NOT (A AND B)", ["NOT A AND B", "A OR B", "A AND NOT B"], "Brackets first, then NOT."]
      ] }
  ]
});

BW.units.push({
  id: "lang", title: "Languages & IDEs", paper: 2, c1: "#8338EC", c2: "#3A86FF", motif: "brackets",
  blurb: "High- and low-level languages, how compilers, interpreters and assemblers translate code, and the IDE tools that help you write and debug it.",
  subs: [
    { id: "levels", title: "High & Low-Level Languages", motif: "brackets",
      notes: ["High-level languages (Python, Java, C#) are close to English, portable, and easier to write, read and debug. One statement may become many machine code instructions.", "Low-level languages: machine code (binary the CPU runs directly) and assembly language (mnemonics like LDA, ADD). Specific to a processor.", "Low-level is used for fast, memory-efficient code or direct hardware control (e.g. embedded systems, drivers)."],
      bank: [
        [1, "Which is a high-level language?", "Python", ["Machine code", "Assembly", "Binary"], "Close to English."],
        [1, "What is machine code?", "Binary instructions the CPU can run directly", ["Python code", "A type of compiler", "An IDE"], "The CPU's native language."],
        [2, "Give an advantage of high-level languages.", "Easier to read, write and debug", ["They run directly on the CPU", "They're specific to one CPU", "They use mnemonics"], "Human-friendly."],
        [2, "Assembly language uses…", "Mnemonics such as ADD and LDA", ["English sentences", "Only 1s and 0s", "Drag-and-drop blocks"], "Short codes for machine instructions."],
        [2, "Why might a programmer use low-level language for a device driver?", "It gives direct control of hardware and memory", ["It's easier to learn", "It's portable to all CPUs", "It has no errors"], "Efficiency and control."],
        [3, "Why is high-level code described as portable?", "It can be translated to run on different processors", ["It fits on a USB stick", "It is always compiled", "It doesn't need translating"], "Not tied to one CPU."],
        [3, "Why must high-level code be translated?", "The CPU only understands machine code", ["To make it shorter", "To add comments", "To encrypt it"], "Translation to binary."]
      ] },
    { id: "translators", title: "Compilers, Interpreters & Assemblers", motif: "bars",
      notes: ["Compiler: translates the whole program into machine code at once, producing an executable. Runs fast; errors are reported after compiling the whole program; source code isn't needed to run it.", "Interpreter: translates and runs one line at a time. Stops at the first error — good for debugging. Slower; needs the interpreter every time it runs.", "Assembler: translates assembly language into machine code."],
      bank: [
        [1, "What does a compiler do?", "Translates the whole program into machine code at once", ["Runs code one line at a time", "Converts assembly only", "Checks spelling in comments"], "Produces an executable."],
        [1, "What translates assembly language into machine code?", "Assembler", ["Compiler", "Interpreter", "Linker"], "Assembly → machine code."],
        [2, "Which translator stops at the first error it meets while running?", "Interpreter", ["Compiler", "Assembler", "Defragmenter"], "Line-by-line."],
        [2, "Give an advantage of a compiler.", "The compiled program runs quickly without needing the translator", ["It stops at each error line by line", "Source code must be shared", "It translates while running"], "Executable runs on its own."],
        [2, "Why are interpreters useful when developing?", "Errors can be found and fixed line by line", ["They produce fast executables", "They hide the source code", "They only work on assembly"], "Quick feedback."],
        [3, "A company wants to sell software without revealing the source code. Which translator?", "Compiler", ["Interpreter", "Assembler", "None"], "Distribute the executable, not the source."],
        [3, "Why does interpreted code usually run slower?", "It is translated every time it runs", ["It is written in binary", "It uses no CPU", "It has fewer lines"], "Translation overhead at runtime."]
      ] },
    { id: "ide", title: "IDE Features", motif: "grid",
      notes: ["An IDE (Integrated Development Environment) provides tools for writing programs.", "Editor: syntax highlighting, auto-complete, auto-indent, line numbers.", "Error diagnostics: highlights and explains errors.", "Run-time environment: runs the program inside the IDE.", "Translator: built-in compiler/interpreter.", "Debugging tools: breakpoints, stepping through code, watching variables."],
      bank: [
        [1, "What does IDE stand for?", "Integrated Development Environment", ["Internal Data Editor", "Interactive Design Engine", "Integrated Debug Executor"], "One app with many tools."],
        [1, "Which IDE feature colours keywords differently?", "Syntax highlighting", ["Breakpoints", "Translator", "Run-time environment"], "Makes code easier to read."],
        [2, "What is a breakpoint?", "A point where the program pauses so values can be inspected", ["A syntax error", "The end of the program", "A type of loop"], "Debugging aid."],
        [2, "Which IDE feature suggests code as you type?", "Auto-complete", ["Error diagnostics", "Stepping", "Defragmentation"], "Saves typing and reduces mistakes."],
        [2, "What does 'stepping' through code do?", "Runs the program one line at a time", ["Deletes lines", "Compiles instantly", "Encrypts code"], "Watch exactly what happens."],
        [3, "How do error diagnostics help a programmer?", "They show where errors are and what may have caused them", ["They fix all logic errors automatically", "They make code run faster", "They write comments"], "Point to the line and the problem."],
        [3, "Why is a run-time environment useful in an IDE?", "The program can be run and tested without leaving the IDE", ["It removes the need for a translator", "It makes the program portable", "It encrypts the output"], "Quick test cycle."]
      ] }
  ]
});

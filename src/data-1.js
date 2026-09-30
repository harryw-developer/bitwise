/* Unit data format: bank rows are [difficulty 1-3, question, correct answer, [wrong answers], explanation] */
BW.units.push({
  id: "arch", title: "Systems Architecture", paper: 1, c1: "#2F9BB3", c2: "#F0A35E", motif: "circuit",
  blurb: "What the CPU is for, how it runs the fetch–decode–execute cycle, the registers and components inside it, what makes it faster, and where embedded systems fit in.",
  subs: [
    { id: "cpu", title: "The CPU & von Neumann", motif: "circuit",
      notes: ["The CPU processes data and instructions by repeatedly carrying out the fetch–decode–execute cycle.", "In von Neumann architecture, data and instructions are stored together in the same memory.", "The ALU does arithmetic and logic; the Control Unit (CU) decodes instructions and sends control signals.", "Cache is small, very fast memory inside or near the CPU that holds frequently used data and instructions."],
      bank: [
        [1, "What does CPU stand for?", "Central Processing Unit", ["Computer Processing Unit", "Central Program Utility", "Core Processing Unit"], "CPU = Central Processing Unit."],
        [1, "What is the main purpose of the CPU?", "To process data and instructions", ["To store files permanently", "To display output on screen", "To connect to the internet"], "The CPU fetches, decodes and executes instructions to process data."],
        [1, "Which part of the CPU performs calculations and logical comparisons?", "ALU", ["Control Unit", "Cache", "Program Counter"], "The Arithmetic Logic Unit does maths and logic operations."],
        [1, "Which part of the CPU decodes instructions and sends control signals?", "Control Unit", ["ALU", "Accumulator", "Cache"], "The CU coordinates the CPU and decodes instructions."],
        [1, "What is cache?", "Small, fast memory in or near the CPU", ["Secondary storage", "A type of ROM", "A register that holds the next address"], "Cache stores frequently used data/instructions so the CPU can access them quickly."],
        [2, "In von Neumann architecture, where are program instructions stored?", "In the same memory as data", ["In a separate instruction memory", "Only in cache", "On the hard disk only"], "Von Neumann uses a single shared memory for both data and instructions."],
        [2, "Why is cache faster to access than RAM?", "It is physically closer to the CPU and uses faster memory", ["It has a larger capacity than RAM", "It is non-volatile", "It is stored on the hard drive"], "Cache is on/near the CPU die and made of faster (more expensive) memory."],
        [2, "Which statement about the ALU is true?", "It stores the result of calculations in the accumulator", ["It holds the address of the next instruction", "It fetches instructions from memory", "It stores the operating system"], "Results from the ALU are placed in the accumulator."],
        [2, "Why is cache kept small?", "It is expensive to make", ["Larger cache is always slower to fetch the next address", "It is volatile", "The OS cannot use more"], "Cache memory is costly, so it is small in capacity."],
        [3, "Which best describes the 'stored program concept'?", "Instructions are stored in memory and fetched and executed one at a time", ["Programs are permanently stored in the CPU", "Programs run directly from secondary storage", "Each program has its own CPU"], "Von Neumann's key idea: program instructions live in main memory alongside data."],
        [3, "Which CPU component would handle comparing two numbers to see if one is larger?", "ALU", ["CU", "MAR", "MDR"], "Comparisons are logical operations, done by the ALU."],
        [3, "A CPU fetches an instruction and data from the same memory. Which architecture is this?", "Von Neumann", ["Harvard", "Cloud", "Peer-to-peer"], "Shared memory for data and instructions = von Neumann."]
      ] },
    { id: "registers", title: "Registers", motif: "grid",
      notes: ["Program Counter (PC): holds the address of the next instruction to be fetched.", "Memory Address Register (MAR): holds the address currently being read from or written to.", "Memory Data Register (MDR): holds the data or instruction just fetched, or about to be written.", "Accumulator (ACC): holds the results of calculations from the ALU."],
      bank: [
        [1, "Which register holds the address of the next instruction?", "Program Counter", ["Accumulator", "MDR", "MAR"], "The PC always points to the next instruction to fetch."],
        [1, "Which register stores the results of calculations?", "Accumulator", ["Program Counter", "MAR", "Cache"], "The ACC holds ALU results."],
        [1, "What does MAR stand for?", "Memory Address Register", ["Main Access Register", "Memory Allocation Register", "Master Address Router"], "MAR = Memory Address Register."],
        [1, "What does MDR stand for?", "Memory Data Register", ["Main Data Router", "Memory Decode Register", "Maximum Data Rate"], "MDR = Memory Data Register."],
        [2, "Which register holds the data that has just been fetched from memory?", "MDR", ["MAR", "PC", "CU"], "Fetched data or instructions arrive in the MDR."],
        [2, "Which register holds the address of the memory location being accessed?", "MAR", ["MDR", "Accumulator", "PC"], "The MAR holds the address to read from or write to."],
        [2, "What is a register?", "A tiny, very fast storage location inside the CPU", ["A type of secondary storage", "A section of RAM used by the OS", "A list of installed programs"], "Registers are the fastest memory, inside the CPU."],
        [2, "The PC contains 7. After the instruction is fetched, what will it usually contain?", "8", ["7", "6", "0"], "The PC is incremented by 1 during fetch."],
        [3, "During the fetch stage, the contents of which register are copied into the MAR?", "Program Counter", ["Accumulator", "MDR", "ALU"], "The address in the PC is copied to the MAR first."],
        [3, "An instruction says 'store the result at address 20'. Which register holds 20 during the write?", "MAR", ["MDR", "PC", "Accumulator"], "The MAR holds the address; the MDR holds the data being written."],
        [3, "Which pair of registers are used directly when communicating with main memory?", "MAR and MDR", ["PC and ACC", "ACC and CU", "PC and ALU"], "The MAR sends the address, the MDR sends/receives the data."]
      ] },
    { id: "fde", title: "Fetch–Decode–Execute", motif: "waves",
      notes: ["Fetch: the address in the PC is copied to the MAR, the instruction at that address is copied into the MDR, and the PC is incremented.", "Decode: the Control Unit works out what the instruction means.", "Execute: the instruction is carried out, e.g. the ALU does a calculation or data is loaded or stored.", "The cycle repeats billions of times per second."],
      bank: [
        [1, "What are the three stages of the CPU cycle, in order?", "Fetch, decode, execute", ["Decode, fetch, execute", "Execute, fetch, decode", "Fetch, execute, decode"], "Fetch → decode → execute, then repeat."],
        [1, "Which component decodes an instruction?", "Control Unit", ["ALU", "MDR", "RAM"], "The CU decodes instructions."],
        [1, "In which stage is an instruction copied from memory into the CPU?", "Fetch", ["Decode", "Execute", "Store"], "Fetch brings the instruction from RAM."],
        [2, "What happens to the Program Counter during the fetch stage?", "It is incremented by 1", ["It is reset to 0", "It is copied to the accumulator", "Nothing"], "PC + 1 so it points at the next instruction."],
        [2, "Where is the fetched instruction first held in the CPU?", "MDR", ["MAR", "PC", "ALU"], "The instruction travels from memory into the MDR."],
        [2, "Which stage might involve the ALU adding two numbers?", "Execute", ["Fetch", "Decode", "Boot"], "Calculations happen during execute."],
        [3, "Put the fetch stage steps in order: (1) PC incremented, (2) PC copied to MAR, (3) instruction copied to MDR.", "2, 3, 1", ["1, 2, 3", "3, 2, 1", "2, 1, 3"], "PC → MAR, memory → MDR, then PC incremented. (The increment can overlap, but it comes after the address is copied.)"],
        [3, "Why is the PC incremented during fetch rather than after execute?", "So it already points at the next instruction, ready for the next cycle", ["To clear the MDR", "To reset the ALU", "It is required by the ALU"], "Incrementing early prepares the next fetch."],
        [3, "An instruction is a jump (branch). What does execute do to the PC?", "Loads it with the jump address", ["Increments it twice", "Sets it to 0", "Copies it into the MDR"], "Branches change the PC to a new address."],
        [2, "What is transferred along the address bus during fetch?", "The address of the instruction", ["The instruction itself", "The result of the ALU", "Control signals only"], "Addresses go on the address bus; data on the data bus."]
      ] },
    { id: "perf", title: "CPU Performance", motif: "bars",
      notes: ["Clock speed: the number of FDE cycles per second, measured in hertz (e.g. 3.5 GHz = 3.5 billion cycles/second).", "Cores: each core can process instructions independently; more cores can mean more work at once, but not all programs can split tasks.", "Cache size: more cache means more data can be held close to the CPU, so fewer slower trips to RAM.", "Doubling cores doesn't double performance: some tasks depend on each other and cores must share resources."],
      bank: [
        [1, "What is clock speed measured in?", "Hertz (Hz)", ["Bytes", "Bits per second", "Watts"], "Clock speed = cycles per second, in Hz (usually GHz)."],
        [1, "A CPU runs at 3 GHz. How many cycles per second is that?", "3 billion", ["3 million", "3 thousand", "300 million"], "Giga = billion, so 3 GHz = 3,000,000,000 cycles per second."],
        [1, "What is a core?", "An independent processing unit within a CPU", ["A type of RAM", "The CPU's cooling fan", "A section of the hard drive"], "Each core can fetch, decode and execute on its own."],
        [2, "Why might doubling the number of cores not double performance?", "Some programs can't split their tasks across cores", ["Cores slow each other's clock speed by half", "More cores reduce cache to zero", "The OS can only use one core"], "Tasks that depend on previous results must run in sequence."],
        [2, "How does a larger cache improve performance?", "More frequently used data can be accessed without going to RAM", ["It increases clock speed", "It adds more cores", "It makes RAM non-volatile"], "Fewer slow RAM accesses = faster."],
        [2, "Which change would most directly increase the number of instructions processed per second on a single core?", "Increasing the clock speed", ["Adding more secondary storage", "Adding a bigger monitor", "Installing a new browser"], "Higher clock speed = more cycles per second."],
        [3, "What is a disadvantage of increasing clock speed (overclocking)?", "The CPU produces more heat", ["The CPU gets fewer cores", "Cache becomes volatile", "RAM becomes smaller"], "Higher speeds generate more heat and may be unstable."],
        [3, "A game uses one main thread. Which upgrade helps it most?", "A faster clock speed", ["Going from 8 to 16 cores", "A bigger hard drive", "More USB ports"], "Single-threaded work benefits from faster cores, not more of them."],
        [3, "Which three characteristics affect CPU performance?", "Clock speed, cache size, number of cores", ["RAM, ROM, virtual memory", "Screen size, battery, keyboard", "Bus width, fan speed, case size"], "The spec lists clock speed, cache size and number of cores."],
        [2, "Cache comes in levels. Which is fastest?", "Level 1", ["Level 2", "Level 3", "They are all the same speed"], "L1 is smallest and fastest; L3 is larger and slower."]
      ] },
    { id: "embedded", title: "Embedded Systems", motif: "grid",
      notes: ["An embedded system is a computer system built into a larger device to perform a dedicated function.", "Examples: washing machines, microwaves, car engine management, traffic lights, smart thermostats.", "They are usually small, low-power, cheap to produce and reliable.", "Their programs are usually stored in ROM/flash and are rarely changed by the user."],
      bank: [
        [1, "What is an embedded system?", "A computer system inside a larger device with a dedicated function", ["A general-purpose desktop PC", "A cloud storage service", "A program embedded in a web page"], "Embedded = built in, single purpose."],
        [1, "Which is an example of an embedded system?", "A washing machine controller", ["A laptop", "A smartphone app store", "A web server farm"], "The washing machine's controller does one job."],
        [1, "Which is NOT usually an embedded system?", "A gaming PC", ["A microwave", "A digital watch", "A car's ABS controller"], "A gaming PC is general-purpose."],
        [2, "Give a typical characteristic of an embedded system.", "Low power consumption", ["Needs a large monitor", "Runs many different user programs", "Very large storage"], "They are designed to be small and efficient."],
        [2, "Where is an embedded system's program usually stored?", "ROM / flash memory", ["Optical disc", "Cloud storage", "Only in RAM"], "The firmware is in non-volatile memory so it's there at power-on."],
        [2, "Why are embedded systems often cheap to make?", "They only need hardware for one specific task", ["They have no CPU", "They use no memory", "They are always made of recycled parts"], "Dedicated hardware can be minimal."],
        [3, "Why are embedded systems considered reliable?", "They perform a small set of tasks and are tested for that purpose", ["They never need power", "They can't contain bugs", "They have unlimited memory"], "Limited function makes them easier to test thoroughly."],
        [3, "A smart thermostat is described as embedded. Which feature supports that?", "It runs dedicated software to control heating", ["It can install any app", "It has a keyboard and mouse", "It has a hard disk"], "Dedicated function inside a larger system (the heating)."],
        [3, "What is the main difference between an embedded system and a general-purpose computer?", "An embedded system does a specific task; a general-purpose one can run many programs", ["Embedded systems have no processor", "General-purpose computers have no memory", "Embedded systems are always faster"], "Dedicated vs general-purpose."]
      ] }
  ]
});

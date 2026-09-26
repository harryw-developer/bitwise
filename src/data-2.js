BW.units.push({
  id: "mem", title: "Memory & Storage", paper: 1, c1: "#6C5CE7", c2: "#FF8FB1", motif: "bits",
  blurb: "Primary and secondary storage, units of data, then the part everyone practises most: binary, hex, binary addition, shifts, and how characters, images and sound are stored.",
  subs: [
    { id: "primary", title: "RAM, ROM & Virtual Memory", motif: "grid",
      notes: ["RAM is volatile, read/write memory holding the OS, programs and data currently in use.", "ROM is non-volatile, read-only memory holding the boot-up instructions (BIOS).", "Virtual memory is part of secondary storage used as extra RAM when RAM is full; it is much slower.", "Primary storage is needed because the CPU can only work on data held in main memory."],
      bank: [
        [1, "Which type of memory is volatile?", "RAM", ["ROM", "SSD", "Optical disc"], "Volatile means contents are lost when power is off; that's RAM."],
        [1, "What does ROM stand for?", "Read Only Memory", ["Random Output Memory", "Rapid Online Memory", "Read Output Module"], "ROM = Read Only Memory."],
        [1, "Where are the boot-up (BIOS) instructions stored?", "ROM", ["RAM", "Cache", "Virtual memory"], "ROM is non-volatile, so the boot program is there at power-on."],
        [1, "What does RAM store?", "Programs and data currently in use", ["Only the BIOS", "Files for long-term storage", "Backups"], "RAM holds whatever is running now, including the OS."],
        [2, "What is virtual memory?", "Part of secondary storage used as temporary RAM", ["Memory inside the CPU", "A type of ROM", "Cloud storage"], "When RAM is full, pages are moved to virtual memory on disk."],
        [2, "Why does using lots of virtual memory slow a computer down?", "Secondary storage is much slower than RAM", ["It uses up the cache", "It increases the clock speed", "It deletes files"], "Swapping data to and from disk is slow."],
        [2, "Which is a difference between RAM and ROM?", "RAM is volatile; ROM is non-volatile", ["ROM is faster than cache", "RAM is read-only", "ROM stores open documents"], "RAM loses contents at power-off; ROM keeps them."],
        [2, "Why do computers need primary storage?", "The CPU needs fast access to current data and instructions", ["To keep files after power-off", "To back up the hard drive", "To connect peripherals"], "Secondary storage is too slow for the CPU to work from directly."],
        [3, "A user has many programs open and the computer slows down. What is the most likely cause?", "RAM is full and virtual memory is being used", ["ROM is full", "The cache is non-volatile", "The CPU has too many registers"], "Heavy use of virtual memory causes slow-down ('disk thrashing')."],
        [3, "What would best fix slow performance caused by virtual memory use?", "Install more RAM", ["Add a bigger ROM", "Use a slower hard drive", "Turn off the cache"], "More RAM means less swapping to disk."],
        [3, "Which statement about ROM is correct?", "Its contents can't normally be changed by the user", ["It is erased when you shut down", "It holds the programs you are editing", "It is secondary storage"], "ROM is read-only in normal use."]
      ] },
    { id: "secondary", title: "Secondary Storage", motif: "waves",
      notes: ["Secondary storage is non-volatile and keeps data long-term.", "Magnetic (HDD): high capacity, cheap per GB, moving parts so less durable.", "Solid state (SSD, USB, SD card): fast, durable, no moving parts, silent, more expensive per GB.", "Optical (CD, DVD, Blu-ray): cheap, portable, low capacity and slow.", "Choose using: capacity, speed, portability, durability, reliability and cost."],
      bank: [
        [1, "Why do computers need secondary storage?", "To store data permanently when the power is off", ["To speed up the CPU", "To hold the boot program", "To replace RAM"], "Secondary storage is non-volatile."],
        [1, "Which storage type uses lasers to read data?", "Optical", ["Magnetic", "Solid state", "Cache"], "CDs, DVDs and Blu-rays are read by lasers."],
        [1, "Which is an example of solid state storage?", "USB flash drive", ["DVD", "Hard disk drive", "Magnetic tape"], "Flash memory = solid state."],
        [1, "Which type of storage has moving parts?", "Magnetic hard disk", ["SSD", "SD card", "USB stick"], "HDDs have spinning platters and a moving read/write head."],
        [2, "Why might an SSD be chosen for a laptop instead of an HDD?", "It is more durable because it has no moving parts", ["It is always cheaper per GB", "It stores data magnetically", "It needs a laser"], "No moving parts = less damage if dropped."],
        [2, "Which is the cheapest per gigabyte for large capacities?", "Magnetic hard disk", ["SSD", "Blu-ray", "USB drive"], "HDDs offer high capacity at low cost."],
        [2, "Which characteristic describes how quickly data can be read or written?", "Speed", ["Durability", "Portability", "Capacity"], "Speed = read/write rate."],
        [2, "A music festival wants to sell photos to visitors on physical media. What's most suitable?", "USB flash drive", ["Internal HDD", "Magnetic tape", "RAM"], "Small, portable, durable and cheap enough."],
        [3, "A company needs to archive 500 TB of old records rarely accessed. Which is most cost-effective?", "Magnetic storage", ["Solid state", "Optical discs", "Cache"], "Magnetic (HDD/tape) is cheapest per GB for huge capacity."],
        [3, "Why are optical discs less popular today?", "Low capacity and slower than other options; streaming/cloud replaces them", ["They are volatile", "They can't be read by any device", "They cost more than SSDs per GB"], "Capacity and speed are limited."],
        [3, "Which characteristic is 'reliability'?", "How consistently the device keeps data without errors over time", ["How much it holds", "How easily it can be carried", "How much it costs"], "Reliability relates to failure rate and data integrity."],
        [2, "Which is NOT a type of secondary storage?", "RAM", ["SSD", "Blu-ray", "HDD"], "RAM is primary storage."]
      ] },
    { id: "units", title: "Units of Data", motif: "bars", gen: ["units", "textSize"],
      notes: ["1 nibble = 4 bits; 1 byte = 8 bits.", "Kilobyte (KB) = 1000 bytes, megabyte (MB) = 1000 KB, gigabyte (GB) = 1000 MB, terabyte (TB) = 1000 GB, petabyte (PB) = 1000 TB.", "Some exams accept 1024 instead of 1000 — both are marked correct in OCR J277.", "Data is stored in binary because computers use switches (transistors) with two states: on and off."],
      bank: [
        [1, "What is the smallest unit of data?", "Bit", ["Nibble", "Byte", "Kilobyte"], "A bit is a single 0 or 1."],
        [1, "How many bits are in a nibble?", "4", ["8", "2", "16"], "Nibble = 4 bits."],
        [1, "Why do computers use binary?", "Their circuits use switches with two states", ["It is easier for humans", "It uses less electricity than denary in all cases", "It was chosen by law"], "Transistors are on (1) or off (0)."],
        [2, "Which order is correct from smallest to largest?", "KB, MB, GB, TB", ["MB, KB, TB, GB", "GB, MB, KB, TB", "KB, GB, MB, PB"], "Kilo < Mega < Giga < Tera < Peta."],
        [2, "Which unit comes after terabyte?", "Petabyte", ["Gigabyte", "Exabit", "Megabyte"], "TB → PB."],
        [3, "A 2 GB file is copied to a 500 MB drive. Will it fit?", "No — 2 GB is 2000 MB", ["Yes — GB is smaller than MB", "Yes, exactly", "Only if compressed to 0 bytes"], "2 GB = 2000 MB, which is more than 500 MB."]
      ] },
    { id: "bin", title: "Binary ↔ Denary", motif: "bits", gen: ["binToDen", "denToBin"],
      notes: ["8-bit place values: 128, 64, 32, 16, 8, 4, 2, 1.", "Binary → denary: add up the place values under each 1.", "Denary → binary: work left to right, put a 1 under a place value if it fits and subtract it.", "8 bits can store 0 to 255 (256 values). n bits can store 2^n values."],
      bank: [
        [1, "What is the largest denary number that can be stored in 8 bits?", "255", ["256", "128", "512"], "11111111 = 255."],
        [1, "What is the place value of the leftmost bit in an 8-bit number?", "128", ["256", "64", "8"], "128 64 32 16 8 4 2 1."],
        [2, "How many different values can 4 bits represent?", "16", ["15", "8", "4"], "2^4 = 16 (0–15)."],
        [3, "What is the largest value in 10 bits?", "1023", ["1024", "512", "999"], "2^10 − 1 = 1023."]
      ] },
    { id: "hex", title: "Hexadecimal", motif: "grid", gen: ["hexToDen", "denToHex", "binToHex", "hexToBin"],
      notes: ["Hex is base 16: digits 0–9 then A=10, B=11, C=12, D=13, E=14, F=15.", "One hex digit represents exactly one nibble (4 bits), so 8 bits = 2 hex digits.", "Hex → denary: first digit × 16 + second digit.", "Hex is used because it's shorter and easier for humans to read than binary, with fewer mistakes; e.g. colour codes, MAC addresses, error codes."],
      bank: [
        [1, "What does the hex digit F represent in denary?", "15", ["16", "14", "10"], "F = 15."],
        [1, "Why do programmers use hexadecimal?", "It is shorter and easier to read than binary", ["Computers process hex faster", "It uses less storage", "It is required by the CPU"], "Computers still store binary; hex is for humans."],
        [2, "How many bits does one hex digit represent?", "4", ["8", "2", "16"], "One hex digit = one nibble."],
        [3, "What is the largest value 2 hex digits can represent?", "FF (255)", ["99 (99)", "FF (256)", "1F (31)"], "FF = 15 × 16 + 15 = 255."]
      ] },
    { id: "binadd", title: "Binary Addition & Overflow", motif: "bits", gen: ["binAdd"],
      notes: ["Rules: 0+0=0, 0+1=1, 1+1=0 carry 1, 1+1+1=1 carry 1.", "Work from right to left, carrying into the next column.", "An overflow error happens when the result needs more bits than are available (e.g. more than 255 in 8 bits)."],
      bank: [
        [1, "What is 1 + 1 in binary?", "10", ["2", "11", "01"], "1 + 1 = 0 carry 1, written 10."],
        [2, "What is 1 + 1 + 1 in binary?", "11", ["3", "10", "111"], "1 + 1 + 1 = 1 carry 1 → 11."],
        [2, "What is an overflow error?", "When a result is too large for the number of bits available", ["When a file is too big for RAM", "When the CPU overheats", "When a number is negative"], "The extra carry bit has nowhere to go."],
        [3, "In 8 bits, 200 + 100 would cause…", "An overflow error", ["A syntax error", "A logic error in the compiler", "No error"], "300 > 255."]
      ] },
    { id: "shifts", title: "Binary Shifts", motif: "waves", gen: ["shift"],
      notes: ["A left shift of 1 multiplies by 2; of n places multiplies by 2^n.", "A right shift of 1 divides by 2 (whole number); of n places divides by 2^n.", "Empty places are filled with 0s; bits shifted off the end are lost, so precision can be lost."],
      bank: [
        [1, "A left shift of one place does what to a binary number?", "Multiplies it by 2", ["Divides it by 2", "Adds 1", "Makes it negative"], "Every bit moves up one place value."],
        [2, "A right shift of 2 places does what?", "Divides by 4", ["Divides by 2", "Multiplies by 4", "Subtracts 2"], "2^2 = 4."],
        [3, "Why can a right shift give an inaccurate answer?", "Bits shifted off the right end are lost", ["Hex is used instead", "The sign changes", "It adds an extra 1"], "E.g. 7 >> 1 = 3, not 3.5."]
      ] }
  ]
});

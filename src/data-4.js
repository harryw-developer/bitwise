BW.units.push({
  id: "sec", title: "Network Security", paper: 1, c1: "#1D3557", c2: "#E63946", motif: "shield",
  blurb: "The threats networks face, from malware and phishing to SQL injection and denial of service, and the methods used to detect, prevent and limit them.",
  subs: [
    { id: "malware", title: "Malware & Social Engineering", motif: "shield",
      notes: ["Malware is malicious software: viruses (attach to files and spread when run), worms (self-replicate across networks), trojans (disguised as legitimate software), ransomware (encrypts files and demands payment), spyware (secretly records activity).", "Social engineering manipulates people rather than systems: phishing (fake emails/sites), pretexting/blagging (inventing a scenario), shouldering (watching someone enter a PIN)."],
      bank: [
        [1, "What is malware?", "Software designed to cause harm or gain unauthorised access", ["Any slow software", "Hardware that breaks", "A type of firewall"], "Malicious + software."],
        [1, "What is phishing?", "Fake messages that trick people into giving personal details", ["Scanning ports on a server", "Flooding a server with requests", "Encrypting files"], "Often looks like a bank or delivery company."],
        [1, "Which malware encrypts files and demands payment?", "Ransomware", ["Spyware", "Worm", "Adware"], "Pay the ransom (you shouldn't) for the key."],
        [2, "How is a worm different from a virus?", "A worm spreads by itself without a host file", ["A worm is harmless", "A virus only affects hardware", "A worm needs the user to open it every time"], "Worms self-replicate across networks."],
        [2, "What is a trojan?", "Malware disguised as legitimate software", ["A firewall rule", "A secure password", "A network cable"], "Named after the Trojan horse."],
        [2, "Watching someone type their PIN over their shoulder is called…", "Shouldering", ["Phishing", "Pharming", "Brute force"], "Also called shoulder surfing."],
        [2, "What is social engineering?", "Manipulating people into revealing information or access", ["Designing social media", "Writing secure code", "Building network hardware"], "People are often the weakest link."],
        [3, "Which sign most suggests a phishing email?", "Urgent request to 'verify your account' via a link", ["Email from a known colleague about a meeting", "A newsletter you subscribed to", "A receipt for a purchase you made"], "Urgency + link + request for details."],
        [3, "What is spyware?", "Software that secretly monitors and sends activity to a third party", ["Antivirus software", "A physical security guard", "A backup tool"], "Keyloggers are a type of spyware."],
        [3, "Blagging (pretexting) means…", "Inventing a scenario to persuade someone to give information", ["Guessing passwords", "Intercepting Wi-Fi", "Sending a DoS attack"], "E.g. pretending to be IT support."]
      ] },
    { id: "attacks", title: "Attacks", motif: "nodes",
      notes: ["Brute-force attack: trying every possible password until one works.", "Denial of service (DoS): flooding a server with requests so it can't respond to real users. DDoS uses many computers (a botnet).", "Data interception and theft: capturing data as it travels across a network (e.g. packet sniffing).", "SQL injection: typing SQL code into an input box to access or change a database."],
      bank: [
        [1, "What is a brute-force attack?", "Trying every possible password combination", ["Tricking users with emails", "Flooding a server", "Stealing a laptop"], "Automated trial and error."],
        [1, "What is the aim of a DoS attack?", "Make a service unavailable to real users", ["Steal passwords", "Encrypt files", "Install updates"], "Denial of service."],
        [2, "What does the extra D in DDoS mean?", "Distributed — many computers attack at once", ["Double", "Data", "Direct"], "Often a botnet of infected machines."],
        [2, "What is SQL injection?", "Entering SQL code into a form to manipulate a database", ["Injecting malware into RAM", "Sending too many emails", "Guessing a password"], "Exploits poor input validation."],
        [2, "What is data interception?", "Capturing data packets as they travel on a network", ["Deleting a database", "Using a firewall", "Backing up data"], "Packet sniffers can read unencrypted traffic."],
        [3, "Which input suggests an SQL injection attempt?", "`' OR '1'='1`", ["john.smith", "Password123", "07700900123"], "Makes the WHERE condition always true."],
        [3, "Which measure best prevents SQL injection?", "Input validation / parameterised queries", ["A longer Wi-Fi password", "Physical locks", "Using fibre cables"], "Never let raw input become part of the query."],
        [3, "What makes brute-force attacks less effective?", "Long, complex passwords and locking accounts after failed attempts", ["Using the same password everywhere", "Shorter passwords", "Turning off the firewall"], "More combinations + limited attempts."]
      ] },
    { id: "prevention", title: "Preventing Vulnerabilities", motif: "shield",
      notes: ["Penetration testing: authorised simulated attacks to find weaknesses before criminals do.", "Anti-malware: detects and removes malware; must be kept updated.", "Firewall: monitors traffic and blocks unauthorised access based on rules.", "User access levels: users only get access to what they need.", "Passwords: strong passwords, changed regularly, plus 2FA.", "Encryption: makes intercepted data unreadable.", "Physical security: locks, CCTV, biometrics, keycards."],
      bank: [
        [1, "What does a firewall do?", "Monitors and controls network traffic based on rules", ["Removes viruses from files", "Makes backups", "Speeds up the CPU"], "Blocks unauthorised traffic."],
        [1, "What is penetration testing?", "Authorised simulated attacks to find weaknesses", ["Testing how fast a network is", "Installing antivirus", "Testing a printer"], "Ethical hacking."],
        [1, "Which is an example of physical security?", "Locked server room", ["Firewall", "Encryption", "Anti-malware"], "Stops people physically reaching hardware."],
        [2, "Why use user access levels?", "So users only access data they need", ["To make passwords shorter", "To speed up Wi-Fi", "To stop backups"], "Limits damage from mistakes or compromised accounts."],
        [2, "Why must anti-malware be updated regularly?", "New malware is created all the time", ["It gets slower otherwise", "Updates remove the firewall", "It's a legal requirement for home users"], "Definitions must include new threats."],
        [2, "Which is the strongest password?", "T7#qL9!vRw2$", ["password123", "Fluffy2009", "qwerty"], "Long, random, mixed character types."],
        [2, "What is two-factor authentication?", "Needing two different types of proof to log in", ["Having two passwords that are the same", "Logging in twice", "Using two firewalls"], "e.g. password + code on your phone."],
        [3, "Which method protects data if a laptop is stolen?", "Full-disk encryption", ["A firewall", "User access levels on the server", "Penetration testing"], "Data is unreadable without the key."],
        [3, "Why is penetration testing done by an authorised person?", "Unauthorised access is illegal under the Computer Misuse Act", ["Only they know the password", "It needs special cables", "It must be done at night"], "Authorisation makes it legal."],
        [3, "Which combination best defends against phishing?", "Staff training and email filtering", ["Bigger hard drives", "Faster CPUs", "Fibre cables"], "People-focused threats need people-focused defences."]
      ] }
  ]
});

BW.units.push({
  id: "sys", title: "Systems Software", paper: 1, c1: "#3A86FF", c2: "#8ECAE6", motif: "grid",
  blurb: "What the operating system does behind the scenes, and the utility programs that keep a computer healthy: encryption, defragmentation, compression and backups.",
  subs: [
    { id: "os", title: "Operating Systems", motif: "grid",
      notes: ["User interface: GUI, command line, menu or voice, so users can interact with the computer.", "Memory management and multitasking: allocates RAM to programs, moves data between RAM and virtual memory, lets several programs run at once.", "Peripheral management and drivers: drivers translate OS instructions for specific hardware.", "User management: accounts, passwords, access rights.", "File management: naming, organising into folders, moving, deleting, permissions."],
      bank: [
        [1, "Which is an operating system?", "Windows", ["Word", "Chrome", "Photoshop"], "macOS, Linux, Android and iOS are also OSs."],
        [1, "What does GUI stand for?", "Graphical User Interface", ["General User Input", "Graphical Utility Installer", "Guided User Instruction"], "Windows, icons, menus, pointer."],
        [1, "What is a device driver?", "Software that lets the OS communicate with a specific piece of hardware", ["A USB cable", "A person who fixes computers", "A type of RAM"], "Translates generic OS commands."],
        [2, "What is multitasking?", "Running more than one program at the same time", ["Using two monitors", "Having two users", "Typing quickly"], "The OS shares CPU time and RAM."],
        [2, "Which OS function allocates RAM to programs?", "Memory management", ["File management", "User management", "Peripheral management"], "Keeps programs from overwriting each other."],
        [2, "Which OS function lets you rename and move files into folders?", "File management", ["Memory management", "Encryption", "Defragmentation"], "Organising and accessing files."],
        [2, "Which OS function handles logins and access rights?", "User management", ["Peripheral management", "Compression", "Memory management"], "Accounts, passwords, permissions."],
        [3, "Why might a command line interface be preferred by a technician?", "It's faster for experts and can run scripts", ["It's easier for beginners", "It uses more RAM", "It shows icons"], "Powerful and scriptable, but needs commands learned."],
        [3, "A new printer is plugged in but won't work. What is the most likely missing software?", "A device driver", ["A firewall", "A compiler", "Defragmentation software"], "The OS needs the right driver."],
        [3, "How does the OS let many programs share one CPU?", "It schedules them, switching quickly between processes", ["It runs them all at the exact same time on one core", "It deletes inactive programs", "It uses ROM"], "Time-slicing gives the illusion of simultaneity."]
      ] },
    { id: "utility", title: "Utility Software", motif: "bars",
      notes: ["Utility software helps maintain and protect the computer.", "Encryption software: scrambles data so it can't be read without a key.", "Defragmentation: reorganises a magnetic hard drive so file parts are stored together — faster access. Not needed on SSDs (and can shorten their life).", "Data compression: reduces file sizes.", "Backup: full backup copies everything; incremental backs up only what changed since the last backup."],
      bank: [
        [1, "What is utility software?", "Software that maintains or protects the computer", ["Games and apps", "The CPU's firmware", "Word processors only"], "Housekeeping tools."],
        [1, "What does defragmentation do?", "Rearranges file fragments so they're stored together", ["Deletes viruses", "Encrypts files", "Adds more RAM"], "Speeds up reading on an HDD."],
        [2, "Why shouldn't an SSD be defragmented?", "There is no speed benefit and it adds wear", ["SSDs are volatile", "It would delete the OS", "SSDs use lasers"], "SSDs have no moving read head."],
        [2, "What is an incremental backup?", "Backing up only data that changed since the last backup", ["Backing up everything every time", "Deleting old backups", "Compressing the OS"], "Faster and smaller, slower to restore."],
        [2, "Why does fragmentation slow down a hard disk?", "The read/write head has to move to many places to read one file", ["Files get deleted", "RAM fills up", "The CPU overheats"], "More head movement = slower."],
        [3, "Give a disadvantage of incremental backups.", "Restoring needs the full backup plus every incremental one", ["They take up more space than full backups", "They copy everything every time", "They can't be automated"], "Restore is more complex."],
        [3, "Which utility would protect data on a USB stick if lost?", "Encryption software", ["Defragmenter", "Disk cleanup", "Compression"], "Unreadable without the key."]
      ] }
  ]
});

BW.units.push({
  id: "eth", title: "Ethical, Legal & Environmental", paper: 1, c1: "#2A9D8F", c2: "#E9C46A", motif: "ridges",
  blurb: "How technology affects people and the planet, the key UK laws you need to name correctly, and the difference between open-source and proprietary software.",
  subs: [
    { id: "impacts", title: "Ethical & Cultural Impacts", motif: "ridges",
      notes: ["Ethical issues: privacy, surveillance, AI bias, job loss through automation.", "Cultural issues: the digital divide (unequal access to technology), changes in how we communicate, online behaviour.", "Stakeholders: anyone affected by a technology (users, companies, workers, governments)."],
      bank: [
        [1, "What is the digital divide?", "The gap between people who have access to technology and those who don't", ["A type of network split", "A computer with two screens", "A partition on a hard drive"], "Caused by cost, location, age, skills."],
        [1, "Who is a stakeholder?", "Anyone affected by a technology or decision", ["Only the shareholders", "Only the programmer", "Only the government"], "Users, staff, the public…"],
        [2, "Which is an ethical concern about facial recognition cameras?", "People's privacy and possible bias", ["They use too little power", "They are too cheap", "They only work at night"], "Surveillance and misidentification."],
        [2, "How can automation affect employment?", "Some jobs are replaced while new tech jobs are created", ["It always creates more jobs in every industry", "It has no effect", "It only affects IT jobs"], "Both loss and creation."],
        [2, "Which could reduce the digital divide?", "Free public Wi-Fi and cheap devices in schools", ["Raising broadband prices", "Removing libraries", "Making websites need fast connections"], "Improves access."],
        [3, "An AI hiring tool rejects more applicants from one group. This is an example of…", "Algorithmic bias", ["A syntax error", "Lossy compression", "A DoS attack"], "Biased training data leads to biased decisions."],
        [3, "Why is a self-driving car accident an ethical dilemma?", "It's unclear who is responsible: the owner, maker or programmer", ["Cars can't be programmed", "It's covered by the Copyright Act", "Cars don't use software"], "Accountability is disputed."]
      ] },
    { id: "environment", title: "Environmental Impacts", motif: "ridges",
      notes: ["Negatives: energy use (especially data centres), e-waste with toxic materials, mining rare metals, short device lifespans.", "Positives: smart tech reducing energy use, remote working reducing travel, modelling climate.", "E-waste is often exported and dismantled unsafely."],
      bank: [
        [1, "What is e-waste?", "Discarded electronic devices", ["Spam email", "Unused RAM", "Deleted files"], "Old phones, PCs, TVs…"],
        [2, "Why is e-waste harmful?", "It contains toxic materials that can pollute land and water", ["It uses too much bandwidth", "It is always recycled safely", "It contains viruses"], "Lead, mercury, cadmium."],
        [2, "How can technology help the environment?", "Smart thermostats reduce energy use", ["Replacing phones every year", "Leaving servers on idle", "Printing all emails"], "Efficiency and monitoring."],
        [2, "Why do data centres have a large environmental impact?", "They use huge amounts of electricity and cooling", ["They are made of plastic", "They produce e-waste every day only", "They use lasers"], "Power and cooling demand."],
        [3, "Why is mining for device components an environmental concern?", "It uses rare, finite resources and damages habitats", ["It creates more bandwidth", "It reduces e-waste", "It is fully renewable"], "Metals like cobalt and lithium."],
        [3, "Which action most directly reduces e-waste?", "Repairing and reusing devices for longer", ["Buying the newest model each year", "Using more cloud storage", "Using lossy compression"], "Longer lifespan = less waste."]
      ] },
    { id: "legislation", title: "Legislation", motif: "grid",
      notes: ["Data Protection Act 2018 (UK GDPR): personal data must be used fairly, lawfully and transparently; kept accurate, secure, not kept longer than needed; people can see their data.", "Computer Misuse Act 1990: illegal to access computers without permission, to do so with intent to commit further crime, or to modify data/cause damage without permission (e.g. spreading malware).", "Copyright, Designs and Patents Act 1988: protects creative work (software, music, images) from being copied or distributed without permission."],
      bank: [
        [1, "Which law makes hacking illegal?", "Computer Misuse Act 1990", ["Data Protection Act 2018", "Copyright, Designs and Patents Act 1988", "Freedom of Information Act 2000"], "Unauthorised access is an offence."],
        [1, "Which law protects people's personal data?", "Data Protection Act 2018", ["Computer Misuse Act 1990", "Copyright, Designs and Patents Act 1988", "Road Traffic Act"], "Along with UK GDPR."],
        [1, "Illegally downloading a film breaks which law?", "Copyright, Designs and Patents Act 1988", ["Computer Misuse Act 1990", "Data Protection Act 2018", "No law"], "Copyright protects creative work."],
        [2, "Under the Data Protection Act, personal data must be…", "Kept secure and not kept longer than necessary", ["Shared with any company that asks", "Kept forever", "Published online"], "Key principles of the Act."],
        [2, "Spreading a virus is illegal under which law?", "Computer Misuse Act 1990", ["Data Protection Act 2018", "Copyright Act 1988", "Consumer Rights Act"], "Unauthorised modification of computer material."],
        [2, "Copying a friend's paid-for software to your PC breaks…", "Copyright, Designs and Patents Act 1988", ["Computer Misuse Act 1990", "Data Protection Act 2018", "No law if it's for personal use"], "Software is protected by copyright."],
        [3, "Logging into a friend's account without permission, just to look, is…", "An offence under the Computer Misuse Act (unauthorised access)", ["Legal if you change nothing", "A Data Protection Act offence only", "Legal if they're your friend"], "Access without permission is enough."],
        [3, "Under the DPA, what right does a data subject have?", "To see the data an organisation holds about them", ["To delete any company's records", "To see anyone else's data", "To free software"], "A subject access request."],
        [3, "A company stores customers' card numbers in plain text and is hacked. Which law did they most likely breach?", "Data Protection Act 2018", ["Computer Misuse Act 1990", "Copyright, Designs and Patents Act 1988", "None"], "Personal data must be kept secure."]
      ] },
    { id: "licensing", title: "Open Source vs Proprietary", motif: "brackets",
      notes: ["Open source: source code is available to view and modify; usually free; community-supported. Examples: Linux, Firefox, LibreOffice.", "Proprietary: source code is closed; you buy a licence to use it; the company provides support and updates. Examples: Microsoft Office, Photoshop.", "Open source can be customised but may lack official support; proprietary is well-supported but costs money and can't be modified."],
      bank: [
        [1, "What is open-source software?", "Software whose source code can be viewed and changed", ["Software that is always paid for", "Software with no code", "Software only for schools"], "Code is public."],
        [1, "Which is proprietary software?", "Microsoft Office", ["Linux", "LibreOffice", "Firefox"], "Closed source, paid licence."],
        [2, "Give an advantage of proprietary software.", "Official support and regular updates from the company", ["You can edit the source code", "It's always free", "Anyone can distribute it"], "Paid-for support."],
        [2, "Give a disadvantage of open-source software.", "There may be no official support", ["You can't see the code", "It's always expensive", "It can't be modified"], "Community support varies."],
        [3, "Why might a company choose open source for its servers?", "No licence costs and it can be customised", ["It can't be modified", "It comes with a legal guarantee", "It's closed source"], "E.g. Linux on web servers."],
        [3, "What does a software licence define?", "How the software may be used, copied and distributed", ["The CPU speed needed", "The colour scheme", "The size of the download"], "Legal terms of use."]
      ] }
  ]
});

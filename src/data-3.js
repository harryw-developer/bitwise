BW.units.find(u => u.id === "mem").subs.push(
  { id: "chars", title: "Characters & Character Sets", motif: "brackets", gen: ["ascii", "charBits", "textSize"],
    notes: ["A character set maps each character to a unique binary code.", "ASCII uses 7 bits (128 characters); extended ASCII uses 8 bits (256).", "Unicode uses more bits per character (up to 32), so it can represent characters from almost every language plus emoji.", "Codes are sequential: if A = 65 then B = 66, C = 67 and so on. a = 97."],
    bank: [
      [1, "What is a character set?", "A defined list of characters and their binary codes", ["A font style", "A set of keyboard shortcuts", "A type of encryption"], "Each character maps to a unique binary number."],
      [1, "How many bits does standard ASCII use per character?", "7", ["8", "16", "32"], "7-bit ASCII = 128 characters."],
      [2, "Why was Unicode introduced?", "ASCII couldn't represent characters from all languages", ["ASCII was too slow", "Unicode uses fewer bits", "ASCII can't store numbers"], "Unicode covers world scripts and symbols."],
      [2, "What is a disadvantage of Unicode compared to ASCII?", "Each character can take more storage", ["It has fewer characters", "It can't store English", "It only works offline"], "More bits per character = bigger files."],
      [3, "Why are character codes grouped sequentially (A, B, C…)?", "So sorting and conversion (e.g. case changes) is easy", ["To reduce file size", "To encrypt text", "Because the keyboard is in alphabetical order"], "Consecutive codes make comparisons simple."],
      [3, "The code for '0' in ASCII is 48. What is the code for '7'?", "55", ["7", "54", "56"], "48 + 7 = 55. Digit characters are not the same as the numbers."]
    ] },
  { id: "images", title: "Images", motif: "grid", gen: ["imageSize", "colours"],
    notes: ["A bitmap image is made of pixels; each pixel's colour is stored as a binary code.", "Colour depth = number of bits per pixel. n bits gives 2^n colours.", "Resolution = number of pixels (width × height).", "File size (bits) = width × height × colour depth. Metadata (e.g. width, height, colour depth) is also stored.", "Higher resolution or colour depth = better quality but larger file size."],
    bank: [
      [1, "What is a pixel?", "A single dot of colour in an image", ["A unit of storage", "A type of compression", "A byte of sound"], "Pixel = picture element."],
      [1, "What is colour depth?", "The number of bits used for each pixel", ["The number of pixels", "The brightness of the image", "The file type"], "More bits per pixel = more possible colours."],
      [1, "What is resolution?", "The number of pixels in an image", ["The number of colours", "The file size in KB", "The compression ratio"], "Often given as width × height."],
      [2, "What happens to file size if colour depth increases?", "It increases", ["It decreases", "It stays the same", "It halves"], "More bits per pixel."],
      [2, "What is metadata in an image file?", "Data about the image, e.g. width, height, colour depth", ["The pixel data itself", "The compression algorithm's source code", "A backup copy"], "Metadata describes the file."],
      [3, "Why is metadata needed for an image to display correctly?", "The computer needs to know the dimensions and colour depth to rebuild it", ["It makes the file smaller", "It encrypts the image", "It is only for search engines"], "Without width/colour depth the bits can't be interpreted."],
      [3, "An image's colour depth goes from 1 bit to 8 bits. File size is multiplied by…", "8", ["2", "256", "4"], "Size ∝ colour depth: 8/1 = 8."]
    ] },
  { id: "sound", title: "Sound", motif: "waves", gen: ["soundSize"],
    notes: ["Analogue sound is sampled: its amplitude is measured at regular intervals and stored as binary.", "Sample rate = samples per second (Hz). Bit depth = bits per sample.", "File size (bits) = sample rate × bit depth × duration in seconds.", "Higher sample rate or bit depth = closer to the original, but larger files."],
    bank: [
      [1, "What is sample rate?", "The number of samples taken per second", ["The number of bits per sample", "The length of the recording", "The volume"], "Measured in hertz (Hz)."],
      [1, "What is bit depth?", "The number of bits used to store each sample", ["Samples per second", "The number of channels", "The loudness"], "More bits = more precise amplitude values."],
      [2, "What is the effect of increasing sample rate?", "Better quality, larger file", ["Smaller file, worse quality", "No effect on size", "Louder sound"], "More samples capture the wave more accurately."],
      [2, "Why must sound be sampled?", "Sound is analogue, and computers store digital data", ["To make it louder", "To encrypt it", "To remove noise"], "Sampling converts the wave to numbers."],
      [3, "Sample rate is doubled and bit depth halved. What happens to file size?", "It stays the same", ["It doubles", "It halves", "It quadruples"], "×2 × ½ = ×1."],
      [3, "What is measured each time a sample is taken?", "The amplitude of the sound wave", ["The frequency of the CPU", "The file size", "The number of channels"], "Each sample records the wave's height."]
    ] },
  { id: "compression", title: "Compression", motif: "bars",
    notes: ["Compression reduces file size: less storage, faster transfer, less bandwidth.", "Lossy removes data permanently (e.g. JPEG, MP3, MP4) — much smaller files but some quality is lost.", "Lossless reduces size without losing any data (e.g. PNG, ZIP, FLAC); the original can be rebuilt exactly.", "Text and program files must use lossless compression — losing data would break them."],
    bank: [
      [1, "Why is compression used?", "To reduce file size", ["To increase image quality", "To add metadata", "To encrypt data"], "Smaller files store and transfer faster."],
      [1, "Which type of compression permanently removes data?", "Lossy", ["Lossless", "Run-length", "Huffman"], "Lossy discards data you're less likely to notice."],
      [1, "Which file type uses lossy compression?", "MP3", ["PNG", "ZIP", "TXT"], "MP3 removes sounds humans hardly hear."],
      [2, "Which compression should be used for a program's source code?", "Lossless", ["Lossy", "Either", "Neither is possible"], "Losing even one character would break the program."],
      [2, "What is an advantage of lossless compression?", "The original file can be restored exactly", ["Files are always smaller than lossy", "It works only on images", "It reduces quality"], "No data is lost."],
      [2, "What is an advantage of lossy compression?", "It usually gives much smaller files", ["The original can be perfectly restored", "It improves quality", "It's used for text files"], "Lossy can dramatically reduce size."],
      [3, "Run-length encoding stores `AAAABBB` as…", "4A3B", ["A4B3C", "AB43", "7AB"], "RLE stores each run as count + value."],
      [3, "A photographer sends print-quality images to a publisher. Which is best?", "Lossless — quality must be preserved", ["Lossy — smaller is always better", "No compression is possible", "Lossy at maximum compression"], "Print needs full detail."],
      [3, "Why might a streaming service use lossy compression?", "Smaller files stream faster using less bandwidth", ["It improves video quality", "It is required by law", "It makes files lossless"], "Lower bandwidth, less buffering."]
    ] }
);

BW.units.push({
  id: "net", title: "Networks & Protocols", paper: 1, c1: "#0FA3B1", c2: "#B5E48C", motif: "nodes",
  blurb: "LANs and WANs, client–server and peer-to-peer, the hardware that joins it all up, the internet and the cloud, topologies, Wi-Fi, IP and MAC addresses, protocols and layers.",
  subs: [
    { id: "types", title: "LANs, WANs & Performance", motif: "nodes",
      notes: ["LAN: small geographical area (one site); hardware usually owned by the organisation.", "WAN: large geographical area; connects LANs; often uses leased infrastructure (e.g. telecoms). The internet is the biggest WAN.", "Factors affecting performance: bandwidth, number of users, transmission media, interference, latency, errors."],
      bank: [
        [1, "What does LAN stand for?", "Local Area Network", ["Large Area Network", "Linked Access Node", "Local Access Number"], "LAN = Local Area Network."],
        [1, "What is a WAN?", "A network covering a large geographical area", ["A network in one building", "A wireless-only network", "A single computer"], "WAN = Wide Area Network."],
        [1, "What is the largest WAN?", "The internet", ["A school network", "Bluetooth", "Ethernet"], "The internet is a global WAN."],
        [2, "Who usually owns the infrastructure of a WAN?", "Third-party telecoms companies", ["The school", "Each user", "Nobody"], "WANs often use leased lines."],
        [2, "What is bandwidth?", "The amount of data that can be transferred in a given time", ["The length of a cable", "The number of devices", "The size of a file"], "Measured in bits per second."],
        [2, "Why might a network slow down at lunchtime in school?", "More users are sharing the bandwidth", ["Cables get shorter", "The server's ROM fills up", "Wi-Fi gets faster"], "More traffic = less bandwidth each."],
        [3, "Which factor does NOT directly affect network performance?", "The colour of the network cables", ["Bandwidth", "Number of users", "Interference"], "Colour has no effect!"],
        [3, "Why is wired usually more reliable than wireless?", "It suffers less interference", ["Wires are always shorter", "It has no bandwidth limits", "It doesn't need protocols"], "Walls and other signals interfere with wireless."]
      ] },
    { id: "models", title: "Client–Server & Peer-to-Peer", motif: "nodes",
      notes: ["Client–server: a central server provides services (files, email, web pages) that clients request. Easier to manage security and backups; the server is a single point of failure and costly.", "Peer-to-peer: all computers are equal and share resources directly. Cheap and simple; harder to manage and back up."],
      bank: [
        [1, "In a client–server network, what does the server do?", "Provides services and resources to clients", ["Requests web pages only", "Acts as a peer", "Nothing, it's a backup"], "Clients request, servers respond."],
        [1, "In a peer-to-peer network…", "All computers have equal status", ["One computer controls all others", "There must be a web server", "Only printers are shared"], "Peers share resources directly."],
        [2, "An advantage of client–server is…", "Centralised backups and security", ["No need for a server", "It's always cheaper", "Every device is equal"], "Managed from one place."],
        [2, "A disadvantage of client–server is…", "If the server fails, clients lose access", ["No central security", "It can't store files", "It only works wirelessly"], "Single point of failure."],
        [2, "Which suits a small home network sharing a printer?", "Peer-to-peer", ["Client–server with a data centre", "A WAN", "A mesh WAN"], "Cheap and simple."],
        [3, "Why is peer-to-peer harder to back up?", "Files are spread across many computers", ["It has no storage", "It uses only the cloud", "It can't use cables"], "No central store."],
        [3, "Online games often use servers to…", "Keep a single authoritative game state for all players", ["Make every player a peer", "Avoid using the internet", "Remove the need for clients"], "A central server stops players disagreeing on state (and cheating)."]
      ] },
    { id: "hardware", title: "Network Hardware", motif: "circuit",
      notes: ["NIC: lets a device connect to a network; has a MAC address.", "Switch: connects devices on a LAN and sends data only to the intended device using MAC addresses.", "Router: connects different networks (e.g. LAN to the internet) and forwards packets using IP addresses.", "WAP: allows wireless devices to connect to a wired network.", "Transmission media: Ethernet (copper) cable, fibre optic (light, fastest, long distance), wireless (radio waves)."],
      bank: [
        [1, "Which device lets wireless devices join a wired network?", "Wireless access point", ["Switch", "Router", "Hub"], "A WAP bridges wireless to wired."],
        [1, "What does NIC stand for?", "Network Interface Controller/Card", ["Network Internet Connection", "New Internal Cable", "Node Identity Code"], "The NIC connects a device to the network."],
        [1, "Which device connects a LAN to the internet?", "Router", ["Switch", "NIC", "Monitor"], "Routers connect different networks."],
        [2, "How does a switch decide where to send data?", "Using the destination MAC address", ["It sends it to every device", "Using the file name", "Randomly"], "Switches learn which MAC is on which port."],
        [2, "Routers forward packets using…", "IP addresses", ["MAC addresses only", "Domain names only", "Port colours"], "Routers work with IP addresses between networks."],
        [2, "Which transmission medium uses light?", "Fibre optic", ["Ethernet copper", "Wi-Fi", "Bluetooth"], "Fibre carries pulses of light."],
        [3, "Why is fibre optic used for long-distance backbones?", "High bandwidth and little signal loss over distance", ["It is the cheapest cable", "It is wireless", "It needs no hardware"], "Light suffers little attenuation or interference."],
        [3, "Why would a school choose a switch over broadcasting data to all devices?", "It reduces unnecessary traffic and improves security", ["It is wireless", "It stores web pages", "It assigns domain names"], "Data only goes to the recipient."]
      ] },
    { id: "internet", title: "The Internet, DNS & Cloud", motif: "nodes",
      notes: ["The internet is a worldwide collection of interconnected networks.", "DNS (Domain Name System) translates domain names like example.com into IP addresses.", "Hosting: storing websites or files on a server connected to the internet.", "The cloud: remote servers accessed over the internet for storage, software and processing. Pros: access anywhere, scalable, no maintenance. Cons: needs internet, security/privacy depends on the provider, ongoing cost."],
      bank: [
        [1, "What is the internet?", "A worldwide network of networks", ["A web browser", "A single giant computer", "The World Wide Web"], "The web is a service that runs on the internet."],
        [1, "What does DNS do?", "Converts domain names into IP addresses", ["Stores web pages", "Encrypts emails", "Assigns MAC addresses"], "Like a phone book for the internet."],
        [2, "What does 'hosting' mean?", "Storing a website on a server connected to the internet", ["Buying a domain name", "Designing a website", "Creating a LAN"], "Hosts make content available online."],
        [2, "Give an advantage of cloud storage.", "Files can be accessed from anywhere with internet", ["It works with no internet", "You own the servers", "It never costs money"], "Accessible from any device online."],
        [2, "Give a disadvantage of cloud storage.", "Depends on having an internet connection", ["Files can be shared easily", "It's scalable", "The provider handles backups"], "No connection, no files."],
        [3, "A DNS server can't resolve a name. What does it do?", "Passes the request to another DNS server", ["Deletes the website", "Uses the MAC address", "Shuts down the router"], "DNS is hierarchical; unresolved requests move up."],
        [3, "Why might a company worry about the cloud?", "Its data is stored by a third party, raising security and legal concerns", ["The cloud can't store data", "Cloud servers are volatile", "It requires Bluetooth"], "Control over data is handed to the provider."]
      ] },
    { id: "topologies", title: "Topologies", motif: "nodes",
      notes: ["Star: each device connects to a central switch. If one cable fails only that device is affected; if the switch fails the whole network fails. Easy to add devices.", "Mesh: devices connect to many others. Full mesh = every device to every other. Very reliable (many routes), but lots of cabling/cost. Wireless mesh is common in homes."],
      bank: [
        [1, "In a star topology, what is at the centre?", "A switch", ["A printer", "A router only", "Nothing"], "All devices connect to the central switch."],
        [1, "In a full mesh topology…", "Every device connects to every other device", ["Devices form a line", "All devices connect to one switch", "Only two devices connect"], "Many redundant links."],
        [2, "What happens in a star network if one cable fails?", "Only that device loses connection", ["The whole network fails", "Every other cable fails", "Data is encrypted"], "Other devices keep working."],
        [2, "What is a disadvantage of a star topology?", "If the central switch fails, the network fails", ["It's very hard to add devices", "Data collisions on one shared cable", "It needs no cables"], "The switch is a single point of failure."],
        [2, "Why is mesh reliable?", "Data can take many routes if one fails", ["It uses fewer cables", "It has one central device", "It only uses fibre"], "Redundancy."],
        [3, "Why is a wired full mesh rarely used in a LAN?", "It needs a lot of cabling and is expensive", ["It is unreliable", "It has a single point of failure", "It can't carry data"], "n(n−1)/2 links is costly."],
        [3, "How many links does a full mesh of 5 devices need?", "10", ["5", "20", "25"], "5 × 4 ÷ 2 = 10."]
      ] },
    { id: "wireless", title: "Wired, Wireless & Encryption", motif: "waves",
      notes: ["Wi-Fi: wireless LAN using radio waves; flexible but affected by walls, distance and interference.", "Bluetooth: short-range wireless for connecting nearby devices.", "Ethernet: wired standard; faster and more reliable/secure than wireless.", "Encryption scrambles data so it can't be understood if intercepted — vital on wireless networks (e.g. WPA2/WPA3)."],
      bank: [
        [1, "Which wireless technology is designed for very short range?", "Bluetooth", ["Wi-Fi", "Ethernet", "Fibre"], "Bluetooth is for nearby devices, e.g. headphones."],
        [1, "Which is a wired networking standard?", "Ethernet", ["Wi-Fi", "Bluetooth", "4G"], "Ethernet uses cables."],
        [2, "Why is encryption important on wireless networks?", "Signals can be intercepted by anyone in range", ["It increases range", "It is needed for Bluetooth to work", "It stops interference"], "Intercepted data is unreadable without the key."],
        [2, "Give an advantage of wireless over wired.", "Devices can move around freely", ["Always faster", "More secure", "No interference"], "Mobility and no cables."],
        [2, "What is encryption?", "Scrambling data so only authorised people can read it", ["Compressing data", "Deleting data", "Backing up data"], "Needs a key to decrypt."],
        [3, "What can reduce Wi-Fi performance?", "Walls, distance and interference from other devices", ["Using Ethernet elsewhere", "Encryption keys being long", "Using a switch"], "Radio signals weaken and suffer interference."],
        [3, "Which is a Wi-Fi security standard?", "WPA3", ["HTTP", "SMTP", "TCP"], "WPA2/WPA3 encrypt Wi-Fi traffic."]
      ] },
    { id: "addressing", title: "IP & MAC Addresses", motif: "grid", gen: ["ipv4"],
      notes: ["IP address: logical address used to route data across networks; can change. IPv4 = 4 numbers 0–255 (32 bits); IPv6 = 128 bits, written in hex.", "MAC address: physical, unique address assigned to a NIC when made; 48 bits, written as 6 pairs of hex digits.", "Standards (e.g. IEEE 802.11 Wi-Fi) are agreed rules so hardware and software from different makers work together."],
      bank: [
        [1, "How many bits are in an IPv4 address?", "32", ["48", "64", "128"], "4 bytes × 8 = 32 bits."],
        [1, "Which address is permanently assigned to a NIC?", "MAC address", ["IP address", "URL", "DNS address"], "Burned in by the manufacturer."],
        [2, "How many bits are in a MAC address?", "48", ["32", "128", "16"], "6 bytes = 48 bits."],
        [2, "Why was IPv6 introduced?", "IPv4 was running out of addresses", ["IPv4 was too secure", "MAC addresses are too long", "To replace DNS"], "IPv6 has 128 bits → vastly more addresses."],
        [2, "How is a MAC address usually written?", "As 6 pairs of hex digits", ["As 4 denary numbers", "As a domain name", "As binary only"], "E.g. 3C:22:FB:9A:10:4E."],
        [3, "Why are standards important in networking?", "Devices from different manufacturers can work together", ["They make hardware more expensive", "They stop encryption", "They remove the need for protocols"], "Compatibility."],
        [3, "Which is a valid IPv6 feature?", "Written as groups of hexadecimal", ["Uses 32 bits", "Only four numbers", "Permanently tied to the NIC"], "IPv6 = eight groups of hex digits."]
      ] },
    { id: "protocols", title: "Protocols & Layers", motif: "bars",
      notes: ["A protocol is a set of rules for how devices communicate.", "TCP/IP: splits data into packets, routes them, and reassembles them; HTTP/HTTPS: web pages (HTTPS encrypted); FTP: transfer files; SMTP: send email; POP: download email (removes from server); IMAP: access email kept on the server.", "Layers: protocols are grouped into layers; each layer does a specific job and only talks to layers above and below. This makes development easier and lets layers be changed independently.", "TCP/IP layers: Application, Transport, Internet, Link."],
      bank: [
        [1, "What is a protocol?", "A set of rules for communication", ["A type of cable", "A network device", "A virus"], "Everyone follows the same rules."],
        [1, "Which protocol is used to send emails?", "SMTP", ["POP", "FTP", "HTTP"], "Simple Mail Transfer Protocol."],
        [1, "Which protocol secures web browsing?", "HTTPS", ["HTTP", "FTP", "SMTP"], "S = secure (encrypted)."],
        [2, "Which protocol keeps emails on the server so they sync across devices?", "IMAP", ["POP", "SMTP", "FTP"], "IMAP accesses mail on the server."],
        [2, "Which protocol transfers files between computers?", "FTP", ["HTTP", "IMAP", "DNS"], "File Transfer Protocol."],
        [2, "What does TCP do?", "Splits data into packets and makes sure they arrive and are reassembled", ["Converts names to IPs", "Encrypts Wi-Fi", "Stores web pages"], "Transport layer reliability."],
        [2, "Which TCP/IP layer contains HTTP?", "Application", ["Transport", "Internet", "Link"], "HTTP, FTP, SMTP etc. are application layer."],
        [3, "Why are network protocols organised into layers?", "Each layer can be developed and changed independently", ["It makes data larger", "It removes the need for hardware", "It stops packets being lost entirely"], "Modularity and interoperability."],
        [3, "Which layer is responsible for routing packets using IP addresses?", "Internet", ["Application", "Transport", "Link"], "Also called the network layer."],
        [3, "A packet contains a header. What does the header include?", "Source and destination addresses and packet number", ["The whole file", "The user's password", "The DNS server list"], "Used for routing and reassembly."]
      ] }
  ]
});

# How to Build the Website, Email, and Domain Setup from Scratch

**Imagine this document as your map.** If you ever need to set up the Aetheris Vision website, domain, and email system again—from zero—this guide will walk you through exactly what to do. You do not need to be a computer expert to follow this. 

---

## 1. Buying the Domain Name

The first step is actually owning the name `aetherisvision.com`.

1. Go to a domain registrar like **Namecheap** or **GoDaddy**.
2. Search for `aetherisvision.com` and buy it.
3. Don't worry about setting up special hosting or email with them; you just need to own the name.

## 2. Connecting the Domain to Cloudflare (The Traffic Cop)

We use Cloudflare because it acts like a super-fast traffic cop for your website, protecting it from hackers and keeping your DNS records organized.

1. Go to **Cloudflare.com** and create a free account.
2. Click "Add a Site" and type in `aetherisvision.com`.
3. Select the "Free Plan" at the bottom.
4. Cloudflare will give you two "Nameservers" (they look like `josh.ns.cloudflare.com`).
5. Go back to where you bought your domain (Namecheap/GoDaddy). Find the "DNS Settings" or "Nameservers" section, and paste the two Cloudflare nameservers there.
6. Now Cloudflare is officially in charge of your domain!

## 3. Setting Up Google Workspace Emails (contact@aetherisvision.com)

To get a professional email address, you use Google Workspace. 

1. Go to **workspace.google.com** and sign up.
2. Tell them you own `aetherisvision.com`.
3. Set your primary email (like `mward@...` or `contact@...`).
4. Google will ask you to prove you own the domain by giving you a "TXT Record."
5. Log into **Cloudflare**, go to "DNS", and add that TXT Record. 
6. Google will verify it.

### Getting Emails to Actually Deliver (MX Records)
1. In Cloudflare, go to DNS -> Add Record.
2. Choose the type **MX**.
3. Google requires you to add 5 of these MX records (like `aspmx.l.google.com`). They will provide you the exact list. Add all 5 to Cloudflare. Now your inbox can receive mail!

### Making Sure Your Emails Don't Go to Spam
Because you are sending from a custom domain, you have to prove to other email servers (like Yahoo or Microsoft) that you aren't a spammer. You do this with three records:

**A. SPF Record (The Bouncer)**
1. In Cloudflare DNS, add a **TXT Record**.
2. Name: `@`
3. Content: `v=spf1 include:_spf.google.com ~all`
*(This tells the world: "Only Google is allowed to send emails on my behalf.")*

**B. DKIM Record (The Wax Seal)**
1. Log into your Google Admin Console.
2. Search for "DKIM" and click **Authenticate Email**.
3. Generate a new key. It will be a massive block of random text.
4. In Cloudflare DNS, add a **TXT Record**.
5. Name: `google._domainkey`
6. Paste that massive text block exactly as it is (make sure you keep the spaces!).
7. Go back to Google Admin and click "Start Authentication."

**C. DMARC Record (The Rulebook)**
1. In Cloudflare DNS, add a **TXT Record**.
2. Name: `_dmarc`
3. Content: `v=DMARC1; p=none; rua=mailto:your_email@aetherisvision.com`

---

## 4. Deploying the Website

The website code lives in a folder called `website` on your computer. We use **Vercel** to put it on the internet for free.

1. Make sure you have the website code on your computer.
2. Download and install **Node.js** from their website.
3. Open your computer's Terminal (the black typing box).
4. Navigate into the website folder:
   ```bash
   cd path/to/website
   ```
5. Install the required tools:
   ```bash
   npm install
   ```
6. Install the Vercel tool:
   ```bash
   npm install -g vercel
   ```
7. Tell Vercel to put it online!
   ```bash
   vercel
   ```
8. Follow the prompts. It will give you a temporary link (like `aetheris-vision.vercel.app`).

---

## 5. Connecting the Website to Your Domain

Now we need the traffic cop (Cloudflare) to point people to your Vercel website.

1. Log into your **Vercel** dashboard.
2. Go to your project settings -> Domains.
3. Type in `aetherisvision.com`.
4. Vercel will say "Add this A Record to your DNS." It will give you an IP address (like `76.76.21.21`).
5. Go to **Cloudflare** -> DNS.
6. Add an **A Record**.
   * Name: `@`
   * Target: The IP address Vercel gave you.
   * Turn the orange cloud on.

**Congratulations!** 
If you type `aetherisvision.com` into your browser, it will now load your website securely, and your custom Google Workspace emails will work without going to the spam folder.

---

## 6. How to Test that Everything Works

If you ever think something is broken, we wrote a script that checks everything automatically!

1. Open your Terminal.
2. Navigate to your website folder.
3. Run the diagnostic tool:
   ```bash
   ./scripts/diagnostics.sh
   ```
4. It will print out a list with green checkmarks (✅) if things are happy, or warning signs (⚠️) if something is missing. 

# Project Submission Report

## 1. Student Details

- **Full Name:** Cyril-John Sinari
- **GitHub Username:** cjsinari
- **Email:** cyril-john.sinari@strathmore.edu
- **Admission Number:** 150377
- **Class Group:** ICS 4D


---

## 2. Deployed Project Link

- **Live GitHub Pages URL:** https://is-project-2026.github.io/encryption-toolkit-150377/
  
---

## 3. Reflection — Grounded in Your Git History

> **Rules:** Every answer below **must include a direct link** to the specific commit, PR, issue, or branch in your repository that demonstrates what you are describing. Answers without working links will not be graded. Generic explanations that could apply to any project will receive zero marks.
>
> **Marks:** A (2 marks) · B (1 mark) · C (1 mark) · D (1 mark) = **5 marks total**

### A. Your Best Commit

- **Commit URL:** https://github.com/IS-PROJECT-2026/encryption-toolkit-150377/commit/b79d5d91e565441c3b67169e26ff81f2ca9c9801

- **Why this one?** This commit uses the `feat` type correctly because it intoduces as an additional new feature, the hash generator as a new tool rather than a modification of existing code. The subject clearly identifies both what was added (the hash generator) and its scope, which includes text and file input, as well as multiple SHA variants. This gives a reviewer enough context to understand the change without opening the diff. The body of code specifies the four algorithm options (SHA-1, SHA-256, SHA-384 and SHA-512) and the dual input modes of file and text. 

### B. A Mistake or Struggle

Link to a commit, PR, or issue where something went wrong — a bad commit message you had to fix, a branch you had to delete and recreate, a PR that needed rework, or a deployment that broke. 

- **Link to the evidence:** https://github.com/IS-PROJECT-2026/encryption-toolkit-150377/pull/23
- **What happened and how did you recover?** While migrating the password and passphrase visibility toggles from emojis to SVG icons, I update the icon swap logic in `app.js` but forgot to include the line that actually changes the input's `type` attribute. The icons toggled correctly but the fields stayed masked regardless. I traced it back to the missing `pwInput.type = isHidden ? 'text' : 'password'` and fixed it using a dedicated `fix` branch and merged it through a PR rather than pushing it directly to main.

### C. A Pull Request You're Proud Of

Paste the URL of the PR that best shows your self-review process — one where the description is clear, the issue linkage is correct, and the diff tells a coherent story.

- **PR URL:** (https://github.com/IS-PROJECT-2026/encryption-toolkit-150377/pull/17)
- **What did you check before merging?** I verfied that the generated password immediately triggered the strength meter and satisfied all 6 criteria, therefore confirming the generator and analyzer were working together correctly rather than in isolation. I also checked that the character set produed randomly mixed output and that clicking the `Generate` button multiple times never produced the same result, validating that `crypto.getRandomValues()` was behind the randomness rather than `Math.random()`

### D. One Thing You Would Do Differently

If you had to restart this project from scratch with everything you know now, name one specific workflow decision you would change (not a code change — a Git/project management decision).

- **What would you change?** I would include a `Closes #n` footer in every PR description from the very first pull reuqest. During Milestone 1, I merged PRs without linking them to their issues, which meant I had to close issues manually after each merge instead of having GitHub do it automatically.

- **Link to the evidence of the original decision:** (https://github.com/IS-PROJECT-2026/encryption-toolkit-150377/milestone/1?closed=1)

---

## 4. Screenshots of Key GitHub Features

Demonstrate your workflow mechanics by embedding your screenshots below.

> **CRITICAL FOR WORKING IMAGES:** Do not type manual folder paths. Edit this file directly on the GitHub web interface, click on the blank line below each prompt, and **paste (Ctrl+V / Cmd+V)** your screenshot. GitHub will automatically upload the file and generate a permanent, working image link for you.

### A. Milestones and Issues
*Provide a screenshot showing your active milestone(s) and the granular tracking issues linked directly to them.*

<img width="1097" height="265" alt="image" src="https://github.com/user-attachments/assets/0bf3e525-3667-4839-8f5a-1dd339a786bd" />


- **Caption:** 3 milestones including:  **Project Structure & Layout (Issues #1-3) **, **Toolkit Implementation (Issues #4-7)**, **Polish & Deployment (Issues #8-11)**

### B. Project Board
*Provide a screenshot of your GitHub Project Board with your issues organized dynamically across columns (To Do, In Progress, Done).*

<img width="1276" height="553" alt="Screenshot 2026-08-16 231658" src="https://github.com/user-attachments/assets/33b43379-9515-4bd1-b288-dfd16bafe501" />


* **Caption:** Kanban board tracking all 11 issues across To Do, In Progress, and Done columns. Each issue was moved manually as work progressed to reflect an accurate, real-time project timeline. All current issues are Done.

### C. Branching Architecture
*Provide a screenshot showing your local or remote Git branch list, highlighting your use of conventional, issue-linked naming patterns (e.g., `feat/`, `fix/`, `style/`).*

<img width="1005" height="618" alt="image" src="https://github.com/user-attachments/assets/abb7e6c1-8396-4136-9b00-337aa52543ca" />


* **Caption:** All branches follow the `type/issue-number-description` naming convention: `feat/1-project-structure, feat/4-password-checker, feat/7-file-encryptor, style/8-ui-refresh, fix/icon-fix`. No code was committed directly to main, except through pull requests.

### D. Pull Requests & Traceability
*Provide a screenshot of a completed or open Pull Request (PR) on GitHub that clearly shows it is linked to a related development issue.*

<img width="1339" height="561" alt="Screenshot 2026-08-16 222418" src="https://github.com/user-attachments/assets/b6baea4c-1fde-4bb2-8307-8058818745d7" />


* **Caption:** The PR diables Jekyll processing to enable GitHub pages to serve the HTML, CSS and JavaScript file for deployment. It closes deployment issue #10

---

## 5. Merge Conflict Evidence

You must engineer **three merge conflicts**, each triggered by a **different cause** from those covered in the lecture. For Conflict 1, document the full resolution lifecycle. For Conflicts 2 and 3, provide the conflict marker screenshot and identify the cause.

> **Marks:** Conflict 1 full chronology (2 marks) · Conflict 2 (1 mark) · Conflict 3 (1 mark) · All three use distinct causes (1 mark) = **5 marks total**

---

### Conflict 1 — Full Chronology

**What cause did you use?** Concurrent changes on the same line, where there were edits on the same `-accent` line on `style.css`

#### Step 1: Generating the Clash
*Screenshot showing the merge attempt and the conflict warning.*

<img width="476" height="52" alt="Screenshot 2026-08-13 224141" src="https://github.com/user-attachments/assets/2f488a76-9c39-405e-97bc-3f454c2c190a" />


* **Caption:** feat/7-file-encryptor collided with style/8-ui-refresh, which had a different accent colour of #6102a0, while the file encryptor branch had an accent colour of #26961c. Git reports CONFLICT (content) and stops the merge. 

#### Step 2: Inside the Code Editor (Conflict Markers)
*Screenshot showing the raw, unresolved conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) in your editor.*

<img width="720" height="482" alt="Screenshot 2026-08-13 222842" src="https://github.com/user-attachments/assets/1a711fb7-d7d7-4d48-b5b6-9eee84524b76" />


* **Caption:** Both branches modified the same line, but with different accent colours. feat/7-file-encryptor changed it to #26961c, while style/8-ui-refresh changed it to #6102a0. Since Git cannot determine which replacement should take precedence, it reports CONFLICT (content) and pauses the merge for manual resolution. I resolved the conflict by restoring the original electric blue (#00d4ff) as the correct design accent, as it was the intended styling for the page.

#### Step 3: Resolution & Clean Merge
*Screenshot of your clean Git history or completed PR showing the conflict was resolved and merged.*

<img width="1267" height="556" alt="image" src="https://github.com/user-attachments/assets/662f0048-bea6-43b9-931f-4f2d3f934ee8" />


* **Caption:** After removing the conflict markers and staging `style.css`, the resolution commit shows a clean single-parent history with the original accent colour restored as the only value on that line.

---

### Conflict 2 — Different Cause

**What cause did you use?** Rename against modify. One branch renamed `app.js` to `toolkot.js` while the other branch independetly modified a line in `app.js`.

**Why does this cause trigger a conflict?** Git tracks file identity across renames, therefore when one branch deletes `app.js` while another branch has committed changes to the same file, Git cannot determine whether to apply the modifications to the renamed file or treat the rename as a deletion. Unlike a line-level conflict, this is an identity conflict, where the two branches disagree on whether the file still exists under its original name.

<img width="641" height="207" alt="Screenshot 2026-08-16 000026" src="https://github.com/user-attachments/assets/867d28e9-b263-4d93-9aa1-31da9ec28fe2" />


* **Caption:** The conflict markers show HEAD's updated file header on line 3 against the incoming branch's different header on line 5 inside app.js. The rename from feat/6 forced Git to surface both versions of the header as a content conflict inside the file it wasn't sure should still exist.

---

### Conflict 3 — Different Cause

**What cause did you use?** Concurrent insertion at the same position. Two branches independently added a new section at the end of `README.md` without knowledge of each other.

**Why does this cause trigger a conflict?** Git resolves changes by comparing both branches against their common ancestor. Both branches inserted new content at the end of the file, where the ancestor had nothing, and since neither insertion can be the "before" state for the other, Git cannot determine which block should come first and marks the entire insertion region as contested.

<img width="589" height="264" alt="Screenshot 2026-08-16 004053" src="https://github.com/user-attachments/assets/e3f84f56-5f9e-4929-aedd-e285b4ff037e" />


* **Caption:** The markers span two entirely new sections, a "Security Notes" block from `feat/4` and a "Known Limitations" block from `feat/5`, which both added content at the same point in `README.md`. I resolved by accepting both changes, as the sections complement each other rather than contradict each other. 

---
##
## 6. Feedback & Evaluation

To help improve this course for future engineering cohorts, please take 2 minutes to fill out the anonymous feedback form. Your honest review helps shape how this program is taught next semester!
- [ ] **Anonymous Evaluation Form:** [Course & Instructor Evaluation](https://forms.gle/YLybnsyXXErKEg3s9)

---
 
## Final Submission
 
Once your repository is complete, submit your work through the official submission form below. The form will **stop accepting responses after Monday, August 17th, 2026** — no late submissions will be accepted.
 
> **Submission Form:** [https://forms.gle/KrT4VxtFtkU3wtYu8](https://forms.gle/KrT4VxtFtkU3wtYu8)

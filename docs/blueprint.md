# **App Name**: Vero Affinity

## Core Features:

- Camouflage To-Do List: A fully functional, generic To-Do List app displayed upon opening to act as a decoy. Users can add/delete dummy tasks.
- Stealth Trigger: Access the hidden chat interface by clicking the Plus icon and writing user name then clicks create. or a Long-Press the app title or Swiping Right on a list item works as backup.
- Encrypted Chat: A full chat suite with text messaging, high-resolution image sharing, and voice note capabilities. Data is encrypted at rest with server-side encryption using MongoDB.
- Silent Notifications: The app operates without push notifications to maintain discretion.
- Data Isolation: Images and voice notes are not saved to the device gallery, residing only within the app's storage. Media files will be stored using MongoDB GridFS.
- Admin Panel: A hidden admin panel accessible by typing `/root-admin` in the chat or triple-tapping the logo. Includes user management and the Amnesia Protocol.
- Amnesia Protocol: A 'PURGE' button in the Admin Panel that instantly wipes the entire conversation history from the server, deleting data for all chats.

## Style Guidelines:

- Background: OLED Black (#000000) - True black. Turns off pixels on OLED screens to save battery.
- Primary Accent: Neon Sky (#00BFFF) - A vivid, electric deep sky blue. Pops aggressively against the black.
- Secondary Accent: Night Navy (#101820) - Your bubbles. A very dark blue-black to complement the neon.
- Text (Primary): Clean White (#FFFFFF) - Maximum contrast for sharp readability.
- Glow Effect: Cyan Glow (#00E5FF) - Used for button shadows or 'active' states.
- Body and headline font: 'Inter' sans-serif for a modern, neutral feel.
- Use generic checklist icon for the 'Daily Tasks' app to maintain the camouflage.
- Employ Glassmorphism (backdrop-blur) on headers and input fields for a soft glass matte look.
- Instant cut (zero animation) between the To-Do List and the hidden chat interface to preserve stealth.
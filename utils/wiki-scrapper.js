const text = `
===Characters===
{| class="CharTable"
!colspan="2"| [[Pirate]]s
!colspan="2"| Citizens
! [[Animal Species|Animals]]
! Outlaws
|-
|
;[[Red Hair Pirates]]
*[[Shanks]]
*[[Benn Beckman]]
*[[Lucky Roux]]
*[[Yasopp]]
*[[Limejuice]]
*[[Hongo]]
*[[Bonk Punch]]
*[[Monster]]
|
;Others
*[[Gol D. Roger|Gold Roger]] (flashback)
*[[Monkey D. Luffy]]
*[[Nami]] (cover)
|
;[[Foosha Village]]
*[[Makino]]
*[[Woop Slap]]
*[[Gyoru]]
*[[Chicken]]
|
;Others
*[[Anjo]] (flashback)
|
*[[Lord of the Coast]]
|
*[[Higuma]]
*[[Mikio Itoo]] (on wanted poster)
|}
`;

const extractCharacters = (text) => {
    const associations = {};
    const lines = text.split('\n');
    let currentAssociation = null;
  
    for (const line of lines) {
      if (line.startsWith('!colspan="')) {
        const match = line.match(/!\w+="?\d*"?\|\s*\[\[(.+?)\]\]/);
        if (match) {
          currentAssociation = match[1];
          associations[currentAssociation] = [];
        }
      } else if (line.startsWith('*[[')) {
        const match = line.match(/\*\[\[(.+?)(?:\|(.+?))?\]\]/);
        if (match && currentAssociation) {
          const characterName = match[2] || match[1];
          const characterLink = `https://onepiece.fandom.com/wiki/${match[1].replace(/\s/g, '_')}`;
          associations[currentAssociation].push({ name: characterName, link: characterLink });
        }
      }
    }
  
    return associations;
  };
  
  // Example usage
  const characters = extractCharacters(text);
  console.log(characters);
  
  
  
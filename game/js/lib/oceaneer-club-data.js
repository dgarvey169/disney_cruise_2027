// =========================================================================
// DISNEY'S OCEANEER CLUB (DECK 2) - SHARED DATA, PROGRESS & HELPERS (#45)
// =========================================================================

const DEFAULT_OCEANEER_PROGRESS = {
    // Wing 1: Wreck-It Ralph Slide
    ralphSlideScore: 0,
    ralphSlideHolder: 'VANELLOPE',
    ralphSlideBadge: false,

    // Wing 2: Walt Disney Imagineering Lab
    imagineeringCoasterScore: 0,
    imagineeringCoasterName: 'DESTINY EXPRESS',
    figmentPrinted: false,
    imagineeringBadge: false,

    // Wing 3: Marvel Super Hero Academy
    marvelTrainingScore: 0,
    marvelSuitHero: 'WAKANDA VIBRANIUM',
    marvelSuitColor: 0x7858F8,
    marvelBadge: false,

    // Wing 4: Star Wars: Cargo Bay
    cargoBayCreaturesTended: 0,
    cargoBayPowerScore: 0,
    starWarsBadge: false,

    // Wing 5: Fairytale Hall
    rapunzelLanterns: 0,
    belleStoriesCompleted: 0,
    sommerhusSnowgies: 0,
    fairytaleBadge: false
};

function getOceaneerProgress() {
    try {
        const raw = localStorage.getItem('disney_destiny_oceaneer_progress');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                return Object.assign({}, DEFAULT_OCEANEER_PROGRESS, parsed);
            }
        }
    } catch (e) {}
    return Object.assign({}, DEFAULT_OCEANEER_PROGRESS);
}

function saveOceaneerProgress(patch) {
    try {
        const current = getOceaneerProgress();
        const updated = Object.assign({}, current, patch || {});
        localStorage.setItem('disney_destiny_oceaneer_progress', JSON.stringify(updated));
        return updated;
    } catch (e) {
        return Object.assign({}, DEFAULT_OCEANEER_PROGRESS, patch || {});
    }
}

function getActiveCharacterData(gameScene) {
    const selected = (gameScene && gameScene.selectedCharacter) ? gameScene.selectedCharacter : 'amelia';
    const isRiley = (selected === 'riley');
    return {
        charId: isRiley ? 'riley' : 'amelia',
        charName: isRiley ? 'RILEY' : 'AMELIA',
        displayName: isRiley ? 'Riley' : 'Amelia',
        idleKey: isRiley ? 'riley_idle' : 'amelia_idle',
        walkAnim: isRiley ? 'riley_walk' : 'amelia_walk',
        idleAnim: isRiley ? 'riley_idle' : 'amelia_idle',
        jumpKey: isRiley ? 'riley_jump' : 'amelia_jump',
        bodyOffsetY: isRiley ? 32 : 24
    };
}

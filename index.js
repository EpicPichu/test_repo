function syncWidth(input) {
    const span = document.getElementById('hidden-span');
    span.textContent = input.value || input.placeholder;
    input.style.width = span.offsetWidth + "px";
}

document.addEventListener('DOMContentLoaded', function() {
    modeinfo = document.getElementById('profile-header-modeinfo');
    usernameinput = document.getElementById('username');

    playermodel = document.getElementById('model-image');

    levelp = document.getElementById('progressbar-size');
    levelv = document.getElementById('level-value');
    
    lastseen_date = document.getElementById('lastseen-date');
    lastseen_time = document.getElementById('lastseen-time');


    gnamev = document.getElementById('guildname');
    gtagv = document.getElementById('guildtag');
    glevelv = document.getElementById('glevel-value');
    gmembersv = document.getElementById('gmembers-value')

    winsp = document.getElementById('wins-position');
    winsv = document.getElementById('wins-value');
    lossp = document.getElementById('loss-position');
    lossv = document.getElementById('loss-value');

    wlrv = document.getElementById('wlr-value');

    fkillsp = document.getElementById('fkills-position');
    fkillsv = document.getElementById('fkills-value');
    fdeathsp = document.getElementById('fdeaths-position');
    fdeathsv = document.getElementById('fdeaths-value');

    fkdrv = document.getElementById('fkdr-value');

    killsp = document.getElementById('kills-position');
    killsv = document.getElementById('kills-value');
    deathsp = document.getElementById('deaths-position');
    deathsv = document.getElementById('deaths-value');

    kdrv = document.getElementById('kdr-value');

    bedsp = document.getElementById('beds-position');
    bedsv = document.getElementById('beds-value');
    arrowsp = document.getElementById('arrows-position');
    arrowsv = document.getElementById('arrows-value');

    ahrv = document.getElementById('ahr-value');

    hwsp = document.getElementById('winstreak-position');
    hwsv = document.getElementById('winstreak-value');
    gamesp = document.getElementById('games-position');
    gamesv = document.getElementById('games-value');

    hubsv = document.getElementById('hubs-value');

    usernameinput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            bedwars(usernameinput.value);
        }
    });
});


// Helper function to get level color
function getLevelColor(level) {
    if (level > 0 && level < 5) return 'gray';
    if ((level >= 5 && level < 10) || (level >= 40 && level < 45)) return 'lime';
    if ((level >= 10 && level < 15) || (level >= 45 && level < 50)) return 'aqua';
    if ((level >= 15 && level < 20) || (level >= 50 && level < 60)) return 'pink';
    if ((level >= 20 && level < 25) || (level >= 60 && level < 75)) return 'orange';
    if ((level >= 25 && level < 30) || (level >= 75 && level < 100)) return 'yellow';
    if (level >= 30 || level === 100) return 'red';
    return 'white';
}

// Helper function to get rank color
function getRankColor(rank) {
    const rankColors = {
        'Champion': 'red',
        'Titan': 'orange',
        'Elite': 'cyan',
        'VIP': 'lime'
    };
    return rankColors[rank] || 'gray';
}

// Helper function to get last online time
function getLastOnline(lastSeen) {
    const currentTime = Date.now();
    const diff = currentTime - lastSeen;
    const days = Math.floor(diff / (1000 * 3600 * 24));
    if (days > 0) return `${days} days ago`;
    const hours = Math.floor(diff / (1000 * 3600));
    if (hours > 0) return `${hours} hours ago`;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes > 0) return `${minutes} minutes ago`;
    return 'Just now';
}

function lastonline_date(unixTimestamp) {
    const date = new Date(unixTimestamp);
    return date.toLocaleDateString('en-US');
}

// Helper function to fetch stats
function fetchStat(stats, entry) {
    const entryData = stats[entry]?.entries;
    const position = entryData && entryData[0] ? entryData[0].place : 0;
    const value = entryData && entryData[0] ? entryData[0].value : 0;
    return [position, value];
}

// Helper function to calculate ratio
function calculateRatio(value1, value2) {
    const num1 = parseInt(value1);
    const num2 = parseInt(value2);
    if (num1 === 0 && num2 === 0) return 0;
    if (num2 === 0) return num1;
    const ratio = num1 / num2;
    if (ratio >= 100) return Math.round(ratio);
    if (ratio >= 10) return Math.round(ratio * 10) / 10;
    return Math.round(ratio * 100) / 100;
}

// Helper function to determine ratio color
function ratioColor(ratio) {
    if (ratio < 1) return 'red';
    if (ratio > 1) return 'lime';
    return 'white';
}



async function bedwars(username, interval = 'Lifetime', gamemode = 'All_Modes') {
    
    try {

        const modelResponse = fetch(`https://starlightskins.lunareclipse.studio/render/custom/${username}/full?wideModel=https://raw.githubusercontent.com/EpicPichu/Epic-Stats/main/assets/models/tnt_sit/pose1.obj&slimModel=https://raw.githubusercontent.com/EpicPichu/Epic-Stats/main/assets/models/tnt_sit/pose1.obj&propModel=https://raw.githubusercontent.com/EpicPichu/Epic-Stats/main/assets/models/tnt_sit/pose1prop.obj&propTexture=https://raw.githubusercontent.com/EpicPichu/Epic-Stats/main/assets/models/tnt_sit/tnt.png&cameraPosition=%7B%22x%22:%228.47%22,%22y%22:%2223.06%22,%22z%22:%22-30.87%22%7D&cameraFocalPoint=%7B%22x%22:%224%22,%22y%22:%2219%22,%22z%22:%22-16.24%22%7D&cameraFOV=45&cameraWidth=374&cameraHeight=437`);

        const profileResponse = await fetch(`https://stats.pika-network.net/api/profile/${username}`);
        
        if (!profileResponse.ok) {
            throw new Error('Profile fetch failed');
        }

        const profile = await profileResponse.json();
        
        let realname = profile.username;
        usernameinput.value = realname
        syncWidth(usernameinput, realname);
        
        lastseen_date.textContent = lastonline_date(profile.lastSeen);
        lastseen_time.textContent = getLastOnline(profile.lastSeen);

        const level = profile.rank.level;
        let level_color = getLevelColor(level);
        const level_bold = level >= 35
        const level_percentage = profile.rank.percentage;

        levelv.textContent = level;
        levelp.style.backgroundColor = level_color;
        levelp.style.width = level_percentage + '%';


        const ranksJson = JSON.stringify(profile.ranks);
        const rankList = ['YouTube', 'Champion', 'Titan', 'Elite', 'VIP'];
        const rank = rankList.find(ranks => ranksJson.includes(ranks)) || null;
        const rank_color = getRankColor(rank);

        usernameinput.style.color = rank_color
        
        let guild, gName, gTag, gLevel, gMembers;

        if (profile.clan) {
            guild = true;
            gnamev.textContent = profile.clan.name;
            gtagv.textContent = profile.clan.tag;
            glevelv.textContent = String(profile.clan.leveling.level);
            gmembersv.textContent = String(profile.clan.members.length);
        } else {
            guild = false;
        }

        const statsResponse = await fetch(`https://stats.pika-network.net/api/profile/${realname}/leaderboard?type=BEDWARS&interval=${interval}&mode=${gamemode}`);

        stats = await statsResponse.json();
        
        if (!statsResponse.ok) {
            throw new Error('Model fetch failed')
        }
        

        // Dubs

        const wins = fetchStat(stats, 'Wins');
        winsp.textContent = wins[0];
        winsv.textContent = wins[1];

        const losses = fetchStat(stats, 'Losses');
        lossp.textContent = losses[0];
        lossv.textContent = losses[1];

        const wlr = calculateRatio(wins[1], losses[1]);
        wlrv.textContent = wlr;
        wlrv.style.color = ratioColor(wlr);
        
        // Finals

        const fkills = fetchStat(stats, 'Final kills');
        fkillsp.textContent = fkills[0];
        fkillsv.textContent = fkills[1];

        const fdeaths = fetchStat(stats, 'Final deaths');
        fdeathsp.textContent = fdeaths[0];
        fdeathsv.textContent = fdeaths[1];

        const fkdr = calculateRatio(fkills[1], fdeaths[1]);
        fkdrv.textContent = fkdr;
        fkdrv.style.color = ratioColor(fkdr);

        // Kills

        const kills = fetchStat(stats, 'Kills');
        killsp.textContent = kills[0];
        killsv.textContent = kills[1];

        const deaths = fetchStat(stats, 'Deaths');
        deathsp.textContent = deaths[0];
        deathsv.textContent = deaths[1];

        const kdr = calculateRatio(kills[1], deaths[1]);
        kdrv.textContent = kdr;
        kdrv.style.color = ratioColor(kdr);

        // Others

        const beds = fetchStat(stats, 'Beds destroyed');
        bedsp.textContent = beds[0];
        bedsv.textContent = beds[1];

        const arrowsshot = fetchStat(stats, 'Arrows shot');
        arrowsp.textContent = arrowsshot[0];
        arrowsv.textContent = arrowsshot[1];

        const arrowshit = fetchStat(stats, 'Arrows hit');
        const ahr = calculateRatio(arrowsshot[1], arrowshit[1]);
        ahrv.textContent = ahr;
        ahrv.style.color = ratioColor(ahr);



        const winstreak = fetchStat(stats, 'Highest winstreak reached');
        hwsp.textContent = winstreak[0];
        hwsv.textContent = winstreak[1];

        const gamesplayed = fetchStat(stats, 'Games played');
        gamesp.textContent = gamesplayed[0];
        gamesv.textContent = gamesplayed[1];

        const hubs = Number(gamesplayed[1]) - (Number(wins[1]) + Number(losses[1]));
        hubsv.textContent = hubs;



       
        
        modelResponse.then(modelResponse => {
            if (!modelResponse.ok) {
                playermodel.src = 'default.png';  // Set default image if fetch fails
                throw new Error('Model fetch failed');
            }
            return modelResponse.blob();  // Return the blob if response is OK
        })
        .then(modelblob => {
            const imageobj = URL.createObjectURL(modelblob);  // Create URL for the image blob
            playermodel.src = imageobj;  // Set the image source to the created URL
        })
        .catch(error => {
            console.error(error);  // Log the error for debugging
        });

    } catch (error) {
        console.error(error.message);
    }
}
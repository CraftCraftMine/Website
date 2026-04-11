/**
 * Project:     CraftCraftMine Info Center – Games API
 * Part of:     CraftCraftMine Netzwerk™ (CCMN™)
 * Copyright:   (c) 2026 CraftCraftMine Netzwerk™ – All rights reserved.
 * Description: Serverless Function – holt kostenlose Spiele von GamerPower.
 *              Nicht für kommerzielle Zwecke bestimmt.
 * Letzte Änderung: 08.04.2026
 * Support:     support@craftcraftmine.net
 *
 * CCMC™ = CraftCraftMine Code™ · CCMN™ = CraftCraftMine Netzwerk™
 */

module.exports = async function handler(req, res) {
  // CORS erlauben für craftcraftmine.net
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const response = await fetch(
      'https://www.gamerpower.com/api/giveaways?platform=steam&type=game&sort-by=popularity'
    );

    if (!response.ok) {
      throw new Error(`GamerPower API Fehler: ${response.status}`);
    }

    const data = await response.json();

    // Nur relevante Felder zurückgeben
    const games = data.map(g => {
      const appId = g.open_giveaway_url?.match(/steam.*?\/app\/(\d+)/)?.[1] || '';
      return {
        title:     g.title,
        thumbnail: g.thumbnail,
        platform:  g.platforms,
        end_date:  g.end_date,
        steam_url: appId
          ? `https://store.steampowered.com/app/${appId}`
          : g.open_giveaway_url,
        steamdb_url: appId
          ? `https://www.steamdb.info/app/${appId}`
          : null,
      };
    });

    // 10 Minuten cachen
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.status(200).json(games);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

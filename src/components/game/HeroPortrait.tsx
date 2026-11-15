// @ts-nocheck — imported game code, typed under the original looser tsconfig
import React, { useEffect, useRef } from 'react';
import { getHeroDef, getHeroSkinDef, HeroId } from '../../game/heroes';
import { buildHeroPalette, HERO_SPRITE_SETS, drawPixelSprite } from '../../game/sprites';

interface HeroPortraitProps {
  heroId: HeroId;
  skinId?: string;
  size?: number;
  animate?: boolean;
  className?: string;
}

const PORTRAIT_ROWS: Record<HeroId, string[]> = {
  lyra: [
    '......oooooooooo......',
    '....oohHHHHHHHHhoo....',
    '...ohHHHhhhhhhHHHho...',
    '..ohHHddssssssddHHho..',
    '..ohHdssswesswessdho..',
    '..ohdssSssssssssSdho..',
    '...odsssseeeeeessdo...',
    '....oooddssssddooo....',
    '...ooGGGGGGGGGGGGoo...',
    '..oCcCCCCCCCCCCCCcCo..',
    '.oCCCCCCCCggggCCCCCCo.',
    '.oCCCCCCCgGGGGgCCCCCo.',
    '.oDDDDDDCCggggCCDDDDDo',
    '..ooooDDDDDDDDDDoooo..',
  ],
  zephyr: [
    '.......oooooooo.......',
    '.....oohHHHHHHhoo.....',
    '....ohHHhhhhhhHHho....',
    '...ohdssssssssssdho...',
    '...ohsswesesswessho...',
    '...ohssssSssSssssho...',
    '....oossssssssssoo....',
    '..oooAAAAAAAAAAAAooo..',
    '.oAAACCCCCCCCCCCCAAAo.',
    '.oAAaCCCCggggCCCCaAAo.',
    '.oCCaCCCgGGGGgCCCaCCo.',
    '..oDDCCCCggggCCCCDDo..',
    '...ooDDDDDDDDDDDDoo...',
    '.....oooooooooooo.....',
  ],
  nyx: [
    '....oo..........oo....',
    '....ohho......ohho....',
    '...ohHHhoooooohHHho...',
    '..ohHHHHHHHHHHHHHHho..',
    '..ohdddddddddddddho...',
    '..odsswesesswesdddo...',
    '...odddddDDDDddddo....',
    '..ooaaCCCCCCCCCCaaoo..',
    '.oAAaaCCCggggCCCaaAAo.',
    '.oACCCCCgGGGGgCCCCCAo.',
    '.oDDCCCCggggggCCCCDDo.',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  ignis: [
    '......oooAAAAooo......',
    '.....oaAAAAAAAAao.....',
    '....oGGggggggggGGo....',
    '...oGgCCCCCCCCCCgGo...',
    '...ogCCweeesswessgo...',
    '...ogCCDDDDDDDDCCgo...',
    '....ogDDDDggggDDgo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oGCCCCCCgGGGGgCCCCCCo',
    '.oCCggggggWWWWggggggCo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  seraphina: [
    '...oo....oooo....oo...',
    '..oAAo..oGGGGoo.oAAo..',
    '.oAAAooohHHHHhhooAAAo.',
    '.oAAaohsssssssssshoAo.',
    '..ooohsswesesswessho..',
    '....ohssssSssSssssho..',
    '....oodssssssssssdoo..',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oCCCCCCCCggggCCCCCCCo',
    '.oCCaCCCCgGGGGgCCCaCCo',
    '.oDDaCCCCggggggCCCaDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  volt: [
    '...oo...oooooo...oo...',
    '..oHHo.ohHHHHho.oHHo..',
    '..ohHhoHHHHHHHHohHho..',
    '...ohdssssssssssdho...',
    '...ohsswesesswessho...',
    '....odssssSSssssdo....',
    '...ooAaCCCCCCCCaAoo...',
    '..oAAaCCCCggggCCCaAAo.',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oCCCCCCCggggggCCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  umbra: [
    '.......oooooooo.......',
    '.....ooHHHHHHHHoo.....',
    '....oGGGGGGGGGGGGo....',
    '...ohHHddddddddHHho...',
    '...ohdswesesswesdho...',
    '....odssssssssssdo....',
    '....oodddSSSSdddoo....',
    '..ooaaCCCCCCCCCCaaoo..',
    '.oAAaCCCCggggCCCCaAAo.',
    '.oACCCCCgGGGGgCCCCCAo.',
    '.oDDCCCCggggggCCCCDDo.',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  aegis: [
    '......oooooooooo......',
    '....oohHHHHHHHHhoo....',
    '...ohCCCCCCCCCCCCho...',
    '...ohGGGGGGGGGGGGho...',
    '...ohddweeeeeewddho...',
    '...ohddddGGGGddddho...',
    '....oohDDDDDDDDhoo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oCCCCCCCCggggCCCCCCCo',
    '.oCCCCCCCgGGGGgCCCCCCo',
    '.oDDCCCCCggggggCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  kitsune: [
    '...ooo..........ooo...',
    '..oHHHo........oHHHo..',
    '..ohHHooooooooooHHho..',
    '...ohHHHHHHHHHHHHho...',
    '...ohdssssssssssdho...',
    '...ohsswesesswessho...',
    '....odssssssssssdo....',
    '..ooAaCCCCCCCCCCaAoo..',
    '.oAAaaCCCggggCCCaaAAo.',
    '.oACCCCCgGGGGgCCCCCAo.',
    '.oDDCCCCggggggCCCCDDo.',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  chronos_mage: [
    '.......oooooooo.......',
    '.....ooGGGGGGGGoo.....',
    '....ohHHHHHHHHHHho....',
    '...ohdssssssssssdho...',
    '...ohsswesessGGssho...',
    '....odssssssssssdo....',
    '....ooddssssssddoo....',
    '..ooaaCCCCCCCCCCaaoo..',
    '.oAAaCCCCggggCCCCaAAo.',
    '.oACCCCCgGGGGgCCCCCAo.',
    '.oDDCCCCggggggCCCCDDo.',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  tidal: [
    '......oooooooooo......',
    '.....oGGGGGGGGGGoo....',
    '....ohHHHHHHHHHHho....',
    '...ohssssssssssssho...',
    '...ohsswesesswessho...',
    '....ohssssssssssho....',
    '....oodssssssssdoo....',
    '..ooAaCCCCCCCCCCaAoo..',
    '.oAAaCCCCggggCCCCaAAo.',
    '.oACCCCCgGGGGgCCCCCAo.',
    '.oDDCCCCggggggCCCCDDo.',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  solaris: [
    '....oooGGGGGGGGooo....',
    '...oGGGGGGGGGGGGGGo...',
    '...ohHHHHHHHHHHHHho...',
    '..ohssssssssssssssho..',
    '..ohsswesesswessssho..',
    '...odssssssssssssdo...',
    '....oooddssssddooo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oGCCCCCCgGGGGgCCCCCCo',
    '.oCCaCCCCggggggCCCaCCo',
    '.oDDaCCCCCCCCCCCCCaDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
  ],
  valkyrie: [
    '..oo....oooooo....oo..',
    '.oGGoo.oGGGGGGoo.oGGo.',
    '.oGGoooohHHHHhhoooGGo.',
    '..oGohdssssssssssdho..',
    '...oohsswesesswessho..',
    '....odssssssssssdo....',
    '...ooGGGGCCCCCCCCGGoo.',
    '..oGCCCCCCgGGGGgCCCCGo',
    '.oACCCCCCggggggggCCCCo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  ronin: [
    '.....oooooooooooo.....',
    '...ooGGGGGGGGGGGGoo...',
    '..oCCCCCCCCCCCCCCCCo..',
    '..oDDDDdssssssssdDDo..',
    '...ohdsswesesswessdo..',
    '....odssssSSSSssssdo..',
    '..ooAaCCCCCCCCCCaAoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  draco: [
    '...oo............oo...',
    '..oGGoo.oooooo.ooGGo..',
    '..oGGoohHHHHHHhoGGoo..',
    '...oohddddddddddho....',
    '...ohdswesesswesdho...',
    '....odddGGGGGGGGdo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oGCCCCCCgGGGGgCCCCCCo',
    '.oCCCCCCCggggggCCCCCCo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  nebula: [
    '......oooAAAAooo......',
    '....ooAAAAAAAAAaoo....',
    '...ohHHHHHHHHHHHHho...',
    '..ohHddssweesswessho..',
    '..ohddssssssssssssho..',
    '...oodddSSSSSSdddoo...',
    '..ooaaCCCCCCCCCCaaoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  druid: [
    '..ooo...oooooo...ooo..',
    '.oHHHo.oGGGGGGooHHHo..',
    '..oHHhoHHHHHHHHhHHo...',
    '...ohssssssssssssho...',
    '...ohsswesesswessho...',
    '....odssssssssssdo....',
    '..ooaACCCCCCCCCCAAoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oCCCCCCgGGGGGGgCCCCCo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  golem_knight: [
    '.....oooooooooooo.....',
    '....oCCCCCCCCCCCCo....',
    '...oCCGGGGGGGGGGCCo...',
    '...oCdddweeeewdddCo...',
    '...oCddddGGGGddddCo...',
    '....oCDDDDDDDDDDCo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oCCCCCCCCggggCCCCCCCC',
    '.oCCCCCCCgGGGGgCCCCCCC',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  jester: [
    '..ooo....oooo....ooo..',
    '.oAAoo..oGGGGoo.ooAAo.',
    '..oAAoohHHHHHHhoAAoo..',
    '...ohdssssssssssdho...',
    '...ohsswesesswessho...',
    '....odssssSSssssdo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oCCCCCCggggggggCCCCCo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  siren: [
    '....oo.oooooooo.oo....',
    '...oAAoHHHHHHHHoAAo...',
    '...ohHHHHHHHHHHHHho...',
    '...ohssssssssssssho...',
    '...ohsswesesswessho...',
    '....odssssssssssdo....',
    '..ooaACCCCCCCCCCAAoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  reaper: [
    '......oooooooooo......',
    '....ooDDDDDDDDDDoo....',
    '...oDDDDDDDDDDDDDDo...',
    '..oDDdweeeeeeeeewddo..',
    '..oDDddddddddddddddo..',
    '...oDDDDssssssssDDo...',
    '..ooaaCCCCCCCCCCaaoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  paladin: [
    '.....oooGGGGGGooo.....',
    '....oGGGGGGGGGGGGo....',
    '...oCCCCCCCCCCCCCCo...',
    '...oCCdsssssssssdCo...',
    '...oCCsswesesswesCo...',
    '....oCDsssssssssDCo...',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oGCCCCCCgGGGGgCCCCCCo',
    '.oCCCCCCCggggggCCCCCCo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  alchemist_hero: [
    '......oooooooooo......',
    '....ooGGGGGGGGGGoo....',
    '...ohHHHHHHHHHHHHho...',
    '...ohsAAAGGGAAAssho...',
    '...ohsswesesswessho...',
    '....odssssssssssdo....',
    '..ooaACCCCCCCCCCAAoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  phantom_thief: [
    '.....oooooooooooo.....',
    '...ooDDDDDDDDDDDDoo...',
    '..oGGGGGGGGGGGGGGGGo..',
    '...ohdswesesswesdho...',
    '...ohsssssSSsssssho...',
    '....oodssssssssdoo....',
    '..ooaaCCCCCCCCCCaaoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  sphinx_guard: [
    '....oooGGGGGGGGooo....',
    '...oGGCCCCCCCCCCGGo...',
    '..oGGCdsssssssssdCGo..',
    '..oGGCswesesswessCGo..',
    '...oGCssssssssssCGo...',
    '....oCDDDDDDDDDDCo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oGCCCCCCgGGGGgCCCCCCo',
    '.oCCCCCCCggggggCCCCCCo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  cryo_queen: [
    '....oo.ooGGGGoo.oo....',
    '...oAAoGGGGGGGGooAo...',
    '...ohHHHHHHHHHHHHho...',
    '...ohdssssssssssdho...',
    '...ohsswesesswessho...',
    '....oodssssssssdoo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  thunder_monk: [
    '....oo..oooooo..oo....',
    '...oAAooGGGGGGooAAo...',
    '...ohdssssssssssdho...',
    '...ohdswesesswesdho...',
    '...ohssssSSSSssssho...',
    '....ooddssssssddoo....',
    '..ooaACCCCCCCCCCAAoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  star_dancer: [
    '......oooAAAAooo......',
    '....ooGGGGGGGGGGoo....',
    '...ohHHHHHHHHHHHHho...',
    '...ohssssssssssssho...',
    '...ohsswesesswessho...',
    '....odssssssssssdo....',
    '..ooaACCCCCCCCCCAAoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  mech_pilot: [
    '.....oooooooooooo.....',
    '....oCCCCCCCCCCCCo....',
    '...oCCGGGGGGGGGGCCo...',
    '...oCddAAAAAAAAAAdo...',
    '...oCdsweeeesweeSdo...',
    '....oCDDDDDDDDDDCo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oCCCCCCCgGGGGgCCCCCCo',
    '.oCCCCCCggggggggCCCCCo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  blood_hunter: [
    '.....oooooooooooo.....',
    '...oDDDDDDDDDDDDDDo...',
    '..oDDohHHHHHHHHhoDDo..',
    '...ohdsswesesswessho..',
    '...ohdsssSSSSssssdho..',
    '....oodssssssssddo....',
    '..ooaaCCCCCCCCCCaaoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  wind_archer: [
    '....oooooooooooooo....',
    '...oGGGGGGGGGGGGGGo...',
    '..oGChHHHHHHHHHHhCGo..',
    '...ohdssssssssssdho...',
    '...ohsswesesswessho...',
    '....odssssssssssdo....',
    '..ooaACCCCCCCCCCAAoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  void_walker: [
    '......oooooooooo......',
    '....ooDDDDDDDDDDoo....',
    '...oDDAAAAAAAAAADDo...',
    '..oDDdweeeeeeeeewddo..',
    '..oDDddddAAAAddddddo..',
    '...oDDDDDDDDDDDDDDo...',
    '..ooaaCCCCCCCCCCaaoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  sun_priest: [
    '....oooGGGGGGGGooo....',
    '...oGGGGGGGGGGGGGGo...',
    '...oGGGGssssssGGGGo...',
    '...ohsswesesswessho...',
    '...ohssssssssssssho...',
    '....ooodssssssdooo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oGCCCCCCgGGGGgCCCCCCo',
    '.oCCCCCCCggggggCCCCCCo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  plague_doc: [
    '.....oooooooooooo.....',
    '...ooDDDDDDDDDDDDoo...',
    '..oGGGGGGGGGGGGGGGGo..',
    '...oDDwAAwDDDDwAAwDo..',
    '...oDDDDssssssssDDo...',
    '....oDDDssssssDDDo....',
    '..ooaaCCCCCCCCCCaaoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  crystal_mage: [
    '......oooAAAAooo......',
    '.....oGGGGGGGGGGoo....',
    '....oGGCCCCCCCCGGo....',
    '...ohssssssssssssho...',
    '...ohsswesesswessho...',
    '....odssssssssssdo....',
    '..ooaACCCCCCCCCCAAoo..',
    '.oAAaCCCCggggggCCCaAAo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
  storm_king: [
    '....oo.ooGGGGoo.oo....',
    '...oGGohHHHHHHhoGGo...',
    '...ohHHHHHHHHHHHHho...',
    '...ohsswesesswessho...',
    '...ohssssSSSSssssho...',
    '....oodssssssssdoo....',
    '..ooGGGGCCCCCCCCGGGGoo',
    '.oGCCCCCCgGGGGgCCCCCCo',
    '.oACCCCCgGGGGGGgCCCCAo',
    '.oDDCCCCCCCCCCCCCCCDDo',
    '..ooDDDDDDDDDDDDDDoo..',
    '....oooooooooooooo....',
    '......................',
    '......................',
  ],
};

function drawHeadgearPixels(
  ctx: CanvasRenderingContext2D,
  headgear: string | undefined,
  pal: Record<string, string>,
  cx: number,
  headTopY: number,
  eyeOffsetY = 4
) {
  if (!headgear || headgear === 'none') return;
  if (headgear === 'crown') {
    ctx.fillStyle = pal.G || '#ffe066';
    ctx.fillRect(cx - 4, headTopY - 3, 2, 2);
    ctx.fillRect(cx - 1, headTopY - 3, 2, 2);
    ctx.fillRect(cx + 2, headTopY - 3, 2, 2);
    ctx.fillStyle = pal.g || '#d49435';
    ctx.fillRect(cx - 4, headTopY - 1, 8, 1);
  } else if (headgear === 'halo') {
    ctx.fillStyle = pal.G || '#fff7bd';
    ctx.fillRect(cx - 5, headTopY - 3, 10, 1);
    ctx.fillStyle = pal.g || '#ffd24d';
    ctx.fillRect(cx - 6, headTopY - 2, 2, 1);
    ctx.fillRect(cx + 4, headTopY - 2, 2, 1);
  } else if (headgear === 'horns') {
    ctx.fillStyle = pal.g || '#ff4d6d';
    ctx.fillRect(cx - 5, headTopY - 2, 2, 3);
    ctx.fillRect(cx + 3, headTopY - 2, 2, 3);
    ctx.fillStyle = pal.G || '#ffffff';
    ctx.fillRect(cx - 5, headTopY - 2, 1, 1);
    ctx.fillRect(cx + 4, headTopY - 2, 1, 1);
  } else if (headgear === 'ears') {
    ctx.fillStyle = pal.H || '#ffd1dc';
    ctx.fillRect(cx - 5, headTopY - 2, 2, 3);
    ctx.fillRect(cx + 3, headTopY - 2, 2, 3);
    ctx.fillStyle = pal.G || '#ffffff';
    ctx.fillRect(cx - 4, headTopY - 1, 1, 1);
    ctx.fillRect(cx + 3, headTopY - 1, 1, 1);
  } else if (headgear === 'visor') {
    const vy = headTopY + eyeOffsetY;
    ctx.fillStyle = pal.a || '#38bdf8';
    ctx.fillRect(cx - 4, vy, 8, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 3, vy, 2, 1);
  } else if (headgear === 'crest') {
    ctx.fillStyle = pal.G || '#ffd27d';
    ctx.fillRect(cx - 1, headTopY - 3, 2, 3);
    ctx.fillStyle = pal.a || '#ff5e8e';
    ctx.fillRect(cx - 3, headTopY - 2, 6, 1);
  }
}

export const HeroPortrait: React.FC<HeroPortraitProps> = ({
  heroId,
  skinId = 'default',
  size = 64,
  animate = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hero = getHeroDef(heroId);
  const skin = getHeroSkinDef(heroId, skinId);

  useEffect(() => {
    let raf = 0;
    let t = 0;
    const render = () => {
      t += 0.05;
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 24, 24);
        // Background frame gradient
        ctx.fillStyle = '#0c0818';
        ctx.fillRect(0, 0, 24, 24);
        ctx.fillStyle = skin.badgeColor + '28';
        ctx.fillRect(1, 1, 22, 22);
        // Subtle corner sparkle
        ctx.fillStyle = skin.badgeColor + '66';
        ctx.fillRect(2, 2, 2, 2);
        ctx.fillRect(20, 2, 2, 2);

        const pal = buildHeroPalette(heroId, hero.modifiers.baseDashes, false, false, skinId);
        const rows = PORTRAIT_ROWS[heroId] ?? PORTRAIT_ROWS.lyra;
        const bobY = animate ? Math.round(Math.sin(t) * 0.6) : 0;
        const baseY = 8 + bobY;
        drawPixelSprite(
          ctx,
          `portrait_${heroId}_${skinId}`,
          rows,
          pal,
          1,
          baseY,
          false,
          1,
          1,
          false
        );
        drawHeadgearPixels(ctx, skin.palette.headgear, { ...pal, a: skin.badgeColor }, 12, baseY, 4);
      }
      if (animate) {
        raf = requestAnimationFrame(render);
      }
    };
    render();
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [heroId, skinId, animate, hero.modifiers.baseDashes, skin]);

  return (
    <canvas
      ref={canvasRef}
      width={24}
      height={24}
      style={{ width: size, height: size }}
      className={`pixel-canvas block border-2 border-[#07050d] ${className}`}
    />
  );
};

export const HeroFullSpriteCanvas: React.FC<{
  heroId: HeroId;
  skinId?: string;
  size?: number;
}> = ({ heroId, skinId = 'default', size = 128 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hero = getHeroDef(heroId);
  const skin = getHeroSkinDef(heroId, skinId);

  useEffect(() => {
    let raf = 0;
    let t = 0;
    const render = () => {
      t += 0.04;
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 36, 36);
        // Crisp 2-tier glowing pixel pedestal
        ctx.fillStyle = '#07050d';
        ctx.fillRect(7, 30, 22, 4);
        ctx.fillStyle = '#1b1430';
        ctx.fillRect(8, 30, 20, 2);
        ctx.fillStyle = '#120d22';
        ctx.fillRect(7, 32, 22, 2);
        ctx.fillStyle = skin.badgeColor + '44';
        ctx.fillRect(9, 29, 18, 2);
        ctx.fillStyle = skin.badgeColor + 'aa';
        ctx.fillRect(11, 30, 14, 1);

        const frames = HERO_SPRITE_SETS[heroId]?.idle ?? HERO_SPRITE_SETS.lyra.idle;
        const frame = frames[Math.floor(t * 2) % frames.length];
        const pal = buildHeroPalette(heroId, hero.modifiers.baseDashes, false, false, skinId);
        const bob = Math.round(Math.sin(t) * 0.7);
        const feetY = 30 + bob;
        drawPixelSprite(
          ctx,
          `showcase_${heroId}_${skinId}_${Math.floor(t * 2) % frames.length}`,
          frame,
          pal,
          18,
          feetY,
          false,
          1,
          1,
          true
        );
        // Headgear pixel flourish anchored to actual top head row
        const hg = skin.palette.headgear;
        if (hg && hg !== 'none') {
          let firstSolidRow = 0;
          for (let r = 0; r < frame.length; r++) {
            if (/[^.\s]/.test(frame[r])) {
              firstSolidRow = r;
              break;
            }
          }
          const headTopY = feetY - frame.length + firstSolidRow;
          drawHeadgearPixels(ctx, hg, { ...pal, a: skin.badgeColor }, 18, headTopY, 3);
        }
      }
      raf = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(raf);
  }, [heroId, skinId, hero.modifiers.baseDashes, skin]);

  return (
    <canvas
      ref={canvasRef}
      width={36}
      height={36}
      style={{ width: size, height: size }}
      className="pixel-canvas block"
    />
  );
};

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(readFileSync(path.join(root, relativePath), 'utf8'));
const itemCatalog = readJson('packages/game-data/data/item-catalog.v1.json');
const audioCatalog = readJson('packages/game-data/data/audio-cues.v1.json');
const shopCatalog = readJson('packages/game-data/data/shop-catalog.v1.json');
const errors = [];

const fail = (message) => errors.push(message);
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const stableId = /^[a-z][a-z0-9_]*(?:[.-][a-z0-9_]+)*$/;

function requireString(value, label) {
  if (!isNonEmptyString(value)) fail(`${label} must be a non-empty string`);
}

function requireUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) fail(`${label} contains duplicate ${value}`);
    seen.add(value);
  }
}

function validateAssetReference(reference, label) {
  if (!isObject(reference)) {
    fail(`${label} must be an object`);
    return;
  }
  requireString(reference.id, `${label}.id`);
  if (reference.status !== 'placeholder') fail(`${label}.status must remain placeholder until an asset is reviewed`);
  if (reference.registryId !== null) fail(`${label}.registryId must be null until a registry asset exists`);
}

if (itemCatalog.schemaVersion !== 1) fail('item catalog schemaVersion must be 1');
if (itemCatalog.status !== 'prototype' || itemCatalog.canonical !== false) fail('item catalog must remain prototype and non-canonical');
if (!Array.isArray(itemCatalog.items)) fail('item catalog items must be an array');

if (audioCatalog.schemaVersion !== 1) fail('audio cue catalog schemaVersion must be 1');
if (audioCatalog.status !== 'prototype') fail('audio cue catalog must remain prototype');
if (!Array.isArray(audioCatalog.cues)) fail('audio cue catalog cues must be an array');

if (shopCatalog.schemaVersion !== 1) fail('shop catalog schemaVersion must be 1');
if (shopCatalog.status !== 'prototype') fail('shop catalog must remain prototype');
if (shopCatalog.provider !== 'unassigned') fail('shop catalog provider must remain unassigned before provider review');
if (!Array.isArray(shopCatalog.offers)) fail('shop catalog offers must be an array');

const items = itemCatalog.items ?? [];
const weapons = items.filter((item) => item.category === 'weapon');
const gear = items.filter((item) => item.category === 'gear');
if (weapons.length !== 10) fail(`item milestone requires exactly 10 weapon concepts; found ${weapons.length}`);
if (gear.length !== 20) fail(`item milestone requires exactly 20 gear concepts; found ${gear.length}`);
if (items.length !== 30) fail(`item milestone requires exactly 30 total concepts; found ${items.length}`);

requireUnique(items.map((item) => item.id), 'item IDs');
requireUnique(items.map((item) => item.sku), 'item SKUs');
requireUnique(items.map((item) => item.shopOfferId), 'item shop offer IDs');

const cueIdList = (audioCatalog.cues ?? []).map((cue) => cue.id);
requireUnique(cueIdList, 'audio cue IDs');
const cueIds = new Set(cueIdList);
for (const requiredCue of ['music.main_menu', 'music.shop', 'ui.shop.select', 'ui.shop.purchase_confirm', 'ui.inventory.navigate']) {
  if (!cueIds.has(requiredCue)) fail(`missing required audio cue ${requiredCue}`);
}

for (const cue of audioCatalog.cues ?? []) {
  requireString(cue.id, 'audio cue id');
  requireString(cue.purpose, `audio cue ${cue.id}.purpose`);
  requireString(cue.soundIdentity, `audio cue ${cue.id}.soundIdentity`);
  if (!stableId.test(cue.id)) fail(`audio cue ${cue.id} does not use a stable ID`);
  if (cue.status !== 'placeholder' || cue.assetRegistryId !== null) fail(`audio cue ${cue.id} must remain an unresolved placeholder`);
  if (!isObject(cue.playback)) {
    fail(`audio cue ${cue.id}.playback must be an object`);
  } else if (!['music', 'ui', 'weapons', 'gear', 'foley'].includes(cue.playback.bus)) {
    fail(`audio cue ${cue.id}.playback.bus is unsupported`);
  }
}

for (const item of items) {
  requireString(item.id, 'item id');
  requireString(item.sku, `item ${item.id}.sku`);
  requireString(item.name, `item ${item.id}.name`);
  requireString(item.description, `item ${item.id}.description`);
  requireString(item.purpose, `item ${item.id}.purpose`);
  requireString(item.visualIdentity, `item ${item.id}.visualIdentity`);
  requireString(item.soundIdentity, `item ${item.id}.soundIdentity`);
  requireString(item.shopOfferId, `item ${item.id}.shopOfferId`);
  if (!stableId.test(item.id)) fail(`item ${item.id} does not use a stable ID`);
  if (!['weapon', 'gear'].includes(item.category)) fail(`item ${item.id} has unsupported milestone category ${item.category}`);
  if (!['common', 'uncommon', 'rare', 'epic'].includes(item.rarity)) fail(`item ${item.id} has invalid rarity ${item.rarity}`);
  if (item.status !== 'prototype' || item.canonical !== false) fail(`item ${item.id} must remain prototype and non-canonical`);
  if (item.requiredLevel !== null && (!Number.isInteger(item.requiredLevel) || item.requiredLevel < 0)) fail(`item ${item.id}.requiredLevel must be null or a non-negative integer`);
  if (!Array.isArray(item.tags) || item.tags.length === 0) fail(`item ${item.id} must have tags`);

  if (!isObject(item.assets)) {
    fail(`item ${item.id}.assets must be an object`);
  } else {
    validateAssetReference(item.assets.previewImage, `item ${item.id}.assets.previewImage`);
    validateAssetReference(item.assets.previewModel, `item ${item.id}.assets.previewModel`);
    if (item.assets.previewModel?.lodPolicy !== 'mobile-three-tier') fail(`item ${item.id} preview model must declare mobile-three-tier LOD`);
    if (!Array.isArray(item.assets.animations) || item.assets.animations.length === 0) fail(`item ${item.id} must declare placeholder animation references`);
    for (const [index, animation] of (item.assets.animations ?? []).entries()) validateAssetReference(animation, `item ${item.id}.assets.animations[${index}]`);
  }

  if (!isObject(item.audio)) {
    fail(`item ${item.id}.audio must be an object`);
  } else {
    for (const key of ['select', 'showcase', 'equip']) {
      if (!cueIds.has(item.audio[key])) fail(`item ${item.id}.audio.${key} references missing cue ${item.audio[key]}`);
    }
  }

  if (item.category === 'weapon') {
    for (const key of ['damage', 'fireRateRpm', 'rangeMeters', 'magazineCapacity', 'handling']) {
      if (!Number.isFinite(item.stats?.[key]) || item.stats[key] <= 0) fail(`weapon ${item.id}.stats.${key} must be positive`);
    }
    if (item.stats?.damage > 100 || item.stats?.handling > 100) fail(`weapon ${item.id} normalized damage and handling must not exceed 100`);
    if (!isObject(item.ammo) || item.ammo.capacity !== item.stats?.magazineCapacity) fail(`weapon ${item.id} ammo capacity must match magazineCapacity`);
    if (!isObject(item.reload) || !['magazine', 'per-round', 'break-action'].includes(item.reload.behavior) || item.reload.durationSeconds <= 0) fail(`weapon ${item.id} reload metadata is invalid`);
    for (const key of ['fire', 'reload']) {
      if (!cueIds.has(item.audio?.[key])) fail(`weapon ${item.id}.audio.${key} references missing cue ${item.audio?.[key]}`);
    }
  }

  if (item.category === 'gear') {
    for (const key of ['protection', 'utility', 'mobility', 'capacity']) {
      const value = item.stats?.[key];
      if (!Number.isFinite(value) || value < 0 || value > 100) fail(`gear ${item.id}.stats.${key} must be between 0 and 100`);
    }
    if (!Array.isArray(item.effects) || item.effects.length === 0) fail(`gear ${item.id} must define at least one effect`);
    for (const [index, effect] of (item.effects ?? []).entries()) {
      requireString(effect.stat, `gear ${item.id}.effects[${index}].stat`);
      if (!['add', 'multiply'].includes(effect.operation)) fail(`gear ${item.id}.effects[${index}] has invalid operation`);
      if (!Number.isFinite(effect.value)) fail(`gear ${item.id}.effects[${index}].value must be finite`);
    }
  }
}

const offers = shopCatalog.offers ?? [];
if (offers.length !== items.length) fail(`shop catalog must contain one offer per item; found ${offers.length} offers for ${items.length} items`);
requireUnique(offers.map((offer) => offer.id), 'offer IDs');
requireUnique(offers.map((offer) => offer.itemId), 'offer item IDs');
requireUnique(offers.map((offer) => offer.entitlementId), 'offer entitlement IDs');

const itemById = new Map(items.map((item) => [item.id, item]));
for (const offer of offers) {
  const item = itemById.get(offer.itemId);
  if (!item) fail(`offer ${offer.id} references missing item ${offer.itemId}`);
  if (item && item.shopOfferId !== offer.id) fail(`item ${offer.itemId} shopOfferId does not match ${offer.id}`);
  if (offer.status !== 'not_for_sale') fail(`offer ${offer.id} must remain not_for_sale before commerce approval`);
  if (offer.price?.status !== 'pending_review' || offer.price?.currency !== 'USD' || offer.price?.unitAmountMinor !== null) fail(`offer ${offer.id} must have a pending, unpriced USD price`);
  if (offer.purchaseLimit !== 1) fail(`offer ${offer.id} purchaseLimit must be 1 for durable ownership`);
  requireString(offer.entitlementId, `offer ${offer.id}.entitlementId`);
}

const serializedShopCatalog = JSON.stringify(shopCatalog).toLowerCase();
for (const forbidden of ['stripe', 'price_', 'secret', 'api_key']) {
  if (serializedShopCatalog.includes(forbidden)) fail(`shop catalog contains provider or secret-specific token ${forbidden}`);
}

if (errors.length > 0) {
  console.error('Game-data validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Game-data validation passed: ${weapons.length} weapon(s), ${gear.length} gear item(s), ${offers.length} offer(s), ${audioCatalog.cues.length} audio cue(s).`);

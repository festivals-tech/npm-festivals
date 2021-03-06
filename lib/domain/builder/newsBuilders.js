'use strict';

var uuid = require('uuid');
var moment = require('moment');

var validator = require('../../validator').validator;
var commonBuilders = require('./commonBuilders');

var NewsDomainBuilder = require('../news').NewsBuilder;

var festivalsModel = require('festivals-model');
var NewsResponseBuilder = festivalsModel.model.newsResponse.NewsResponseBuilder;
var NewsStatusEnum = festivalsModel.model.newsStatusEnum.NewsStatusEnum;
var MAIN_NEWS_NAME = 'MAIN';

var buildNewsResponse = function buildNewsResponse(data) {
  if (!data) {
    return null;
  }

  var mainImage = commonBuilders.buildMainImageResponse(data.images);
  var authors = commonBuilders.buildAuthorResponse(data.authors);

  return new NewsResponseBuilder()
    .withId(data.id)
    .withName(data.name)
    .withDescription(data.description)
    .withStatus(data.status)
    .withMainImage(mainImage)
    .withAuthors(authors)
    .withTags(data.tags)
    .withPublishedAt(data.publishedAt)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .build();
};

var buildNewsDomain = function buildNewsDomain(festivalId, params, newObject) {

  var id;
  var createdAt;
  var now = moment().toISOString();
  var validate = validator(newObject);

  festivalId = festivalId || MAIN_NEWS_NAME;
  var name = validate.getString(params.name, 'name');
  var description = validate.getString(params.description, 'description');
  var status = validate.getEnum(NewsStatusEnum.getStatus(params.status), 'status', NewsStatusEnum.CREATED);
  var tags = validate.getArrayOfString(params.tags, 'tags', []);
  var authors = commonBuilders.buildAuthorDomain(params.authors);
  var images = commonBuilders.buildImagesDomain(validate, params);
  var publishedAt = validate.getString(params.publishedAt, 'publishedAt', null);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  if (publishedAt) {
    publishedAt = moment(publishedAt).toISOString();
  }

  var news = new NewsDomainBuilder()
    .withId(id)
    .withName(name)
    .withDescription(description)
    .withStatus(status)
    .withImages(images)
    .withAuthors(authors)
    .withTags(tags)
    .withFestival(festivalId)
    .withPublishedAt(publishedAt)
    .withCreatedAt(createdAt)
    .withUpdatedAt(createdAt)
    .build();

  commonBuilders.removeUndefined(news);
  return news;
};

module.exports = {
  buildNewsResponse: buildNewsResponse,
  buildNewsDomain: buildNewsDomain,
  MAIN_NEWS_NAME: MAIN_NEWS_NAME
};
var config = require('config');
var uuid = require('uuid');
var moment = require('moment');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var providerName = config.provider.selected;

var provider = require('../../lib/provider/provider').getProvider();

var festivalsModel = require('festivals-model');

var FestivalBuilder = require('../../lib/domain/festival').FestivalBuilder;
var DurationBuilder = require('../../lib/domain/duration').DurationBuilder;
var LocationBuilder = require('../../lib/domain/location').LocationBuilder;
var ImageBuilder = require('../../lib/domain/image').ImageBuilder;
var PlaceBuilder = require('../../lib/domain/place').PlaceBuilder;
var EventBuilder = require('../../lib/domain/event').EventBuilder;

var SearchFestivalEventsRequestBuilder = festivalsModel.model.searchFestivalEventsRequest.SearchFestivalEventsRequestBuilder;
var SearchFestivalsRequestBuilder = festivalsModel.model.searchFestivalsRequest.SearchFestivalsRequestBuilder;

describe(providerName + ' provider test', function () {

  var festivalId = null;
  var placeId = null;
  var eventId = null;
  var createdAt = moment().toISOString();
  var finishAt = moment().add(2, 'days').toISOString();

  it('should create festival', function (done) {

    festivalId = uuid.v4();
    var name = 'name-' + festivalId;
    var description = 'description-' + festivalId;
    var tags = ['fantasy'];

    var duration = new DurationBuilder()
      .withStartAt(createdAt)
      .withFinishAt(finishAt)
      .build();

    var location = new LocationBuilder()
      .withName('location-name')
      .withState('location-state')
      .withCountry('PL')
      .withStreet('location-street')
      .withZip('location-zip')
      .withOpeningTimes([])
      .withFestival(festivalId)
      .build();

    var images = [
      new ImageBuilder()
        .withUrl('http://podgk.pl/wp-content/uploads/2011/06/dni_fantastyki_podgk.jpg')
        .withContent(null)
        .withOrder(0)
        .build()
    ];

    var locations = [location];
    var newFestival = new FestivalBuilder()
      .withId(festivalId)
      .withName(name)
      .withDescription(description)
      .withTags(tags)
      .withImages(images)
      .withCreatedAt(createdAt)
      .withUpdatedAt(createdAt)
      .withDuration(duration)
      .withLocations(locations)
      .build();

    provider.createFestival(newFestival, function (err, festival) {
      should.not.exist(err);
      should.exist(festival);

      festival.id.should.be.equal(festivalId);
      done();
    });
  });

  it('should get festival', function (done) {

    provider.getFestival(festivalId, function (err, festival) {
      should.not.exist(err);
      should.exist(festival);

      festival.id.should.be.equal(festivalId);
      should.exist(festival.name);
      should.exist(festival.description);
      should.exist(festival.tags);
      should.exist(festival.images);
      festival.createdAt.should.be.equal(createdAt);
      festival.updatedAt.should.be.equal(createdAt);
      should.exist(festival.duration);
      should.exist(festival.locations);

      done();
    });
  });


  it('should get festivals collection', function (done) {

    var searchFestivalsRequest = new SearchFestivalsRequestBuilder()
    //.withName(name)
    //.withCountry(country)
    //.withStartAt(startAt)
    //.withLimit(limit)
    //.withOffset(offset)
      .build();

    provider.getFestivals(searchFestivalsRequest, function (err, events) {
      should.not.exist(err);
      should.exist(events);
      should.exist(events.total);
      should.exist(events.festivals);

      done();
    });
  });

  it('should create festival place', function (done) {

    placeId = uuid.v4();
    var name = 'name-' + placeId;
    var description = 'description-' + placeId;

    var duration = new DurationBuilder()
      .withStartAt(createdAt)
      .withFinishAt(finishAt)
      .build();

    var openingTimes = [
      duration
    ];

    var newPlace = new PlaceBuilder()
      .withId(placeId)
      .withParent(null)
      .withName(name)
      .withOpeningTimes(openingTimes)
      .build();

    provider.createFestivalPlace(festivalId, newPlace, function (err, place) {

      should.not.exist(err);
      should.exist(place);

      place.id.should.be.equal(placeId);
      done();
    });
  });

  it('should create festival event', function (done) {

    eventId = uuid.v4();
    var name = 'name-' + eventId;
    var description = 'description-' + eventId;
    var tags = ['fantasy'];
    var category = 'category';
    var finishAt = moment().add(2, 'hours').toISOString();

    var duration = new DurationBuilder()
      .withStartAt(createdAt)
      .withFinishAt(finishAt)
      .build();

    var images = [
      //new ImageBuilder()
      //.withSmall('http://small')
      //.withMedium('http://medium')
      //.withLarge('http://large')
      //.build()
    ];

    var newEvent = new EventBuilder()
      .withId(eventId)
      .withName(name)
      .withDescription(description)
      .withTags(tags)
      //.withImages(images)
      .withDuration(duration)
      .withPlace(placeId)
      .withCategory(category)
      .withCreatedAt(createdAt)
      .withUpdatedAt(createdAt)
      .build();

    provider.createFestivalEvent(festivalId, newEvent, function (err, event) {
      should.not.exist(err);
      should.exist(event);

      event.id.should.be.equal(eventId);
      done();
    });
  });

  it('should get festival event', function (done) {

    provider.getFestivalEvent(festivalId, eventId, function (err, event) {
      should.not.exist(err);
      should.exist(event);

      event.id.should.be.equal(eventId);
      should.exist(event.name);
      should.exist(event.description);
      should.exist(event.tags);
      //should.exist(event.images);
      should.exist(event.duration);
      should.exist(event.place);
      should.exist(event.category);
      event.createdAt.should.be.equal(createdAt);
      event.updatedAt.should.be.equal(createdAt);

      done();
    });
  });

  it('should get festival events collection', function (done) {

    var searchFestivalEventsRequest = new SearchFestivalEventsRequestBuilder()
    //.withName(name)
    //.withPlace(place)
    //.withStartAt(startAt)
    //.withFinishAt(finishAt)
    //.withCategory(category)
    //.withLimit(limit)
    //.withOffset(offset)
      .build();

    provider.getFestivalEvents(festivalId, searchFestivalEventsRequest, function (err, events) {
      should.not.exist(err);
      should.exist(events);
      should.exist(events.total);
      should.exist(events.events);

      done();
    });
  });

});
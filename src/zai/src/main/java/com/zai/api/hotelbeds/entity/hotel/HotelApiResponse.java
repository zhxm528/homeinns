package com.zai.api.hotelbeds.entity.hotel;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class HotelApiResponse {
    private static HotelApiResponse instance;
    
    public static HotelApiResponse getInstance() {
        if (instance == null) {
            instance = new HotelApiResponse();
        }
        return instance;
    }
    
    private int from;
    private int to;
    private int total;
    
    @JsonProperty("auditData")
    private AuditData auditData;
    
    private List<Hotel> hotels;

    public int getFrom() {
        return from;
    }

    public void setFrom(int from) {
        this.from = from;
    }

    public int getTo() {
        return to;
    }

    public void setTo(int to) {
        this.to = to;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public AuditData getAuditData() {
        return auditData;
    }

    public void setAuditData(AuditData auditData) {
        this.auditData = auditData;
    }

    public List<Hotel> getHotels() {
        return hotels;
    }

    public void setHotels(List<Hotel> hotels) {
        this.hotels = hotels;
    }

    public static class AuditData {
        @JsonProperty("processTime")
        private String processTime;
        private String timestamp;
        
        @JsonProperty("requestHost")
        private String requestHost;
        
        @JsonProperty("serverId")
        private String serverId;
        private String environment;
        private String release;

        public String getProcessTime() {
            return processTime;
        }

        public void setProcessTime(String processTime) {
            this.processTime = processTime;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }

        public String getRequestHost() {
            return requestHost;
        }

        public void setRequestHost(String requestHost) {
            this.requestHost = requestHost;
        }

        public String getServerId() {
            return serverId;
        }

        public void setServerId(String serverId) {
            this.serverId = serverId;
        }

        public String getEnvironment() {
            return environment;
        }

        public void setEnvironment(String environment) {
            this.environment = environment;
        }

        public String getRelease() {
            return release;
        }

        public void setRelease(String release) {
            this.release = release;
        }
    }

    public static class Hotel {
        private int code;
        private Name name;
        private Description description;
        
        @JsonProperty("countryCode")
        private String countryCode;
        
        @JsonProperty("stateCode")
        private String stateCode;
        
        @JsonProperty("destinationCode")
        private String destinationCode;
        
        @JsonProperty("zoneCode")
        private int zoneCode;
        private Coordinates coordinates;
        
        @JsonProperty("categoryCode")
        private String categoryCode;
        
        @JsonProperty("categoryGroupCode")
        private String categoryGroupCode;
        
        @JsonProperty("chainCode")
        private String chainCode;
        
        @JsonProperty("accommodationTypeCode")
        private String accommodationTypeCode;
        
        @JsonProperty("boardCodes")
        private List<String> boardCodes;
        
        @JsonProperty("segmentCodes")
        private List<String> segmentCodes;
        private Address address;
        
        @JsonProperty("postalCode")
        private String postalCode;
        private City city;
        private String email;
        private List<Phone> phones;
        private List<Room> rooms;
        private List<Wildcard> wildcards;
        
        @JsonProperty("lastUpdate")
        private String lastUpdate;
        private int ranking;

        public int getCode() {
            return code;
        }

        public void setCode(int code) {
            this.code = code;
        }

        public Name getName() {
            return name;
        }

        public void setName(Name name) {
            this.name = name;
        }

        public Description getDescription() {
            return description;
        }

        public void setDescription(Description description) {
            this.description = description;
        }

        public String getCountryCode() {
            return countryCode;
        }

        public void setCountryCode(String countryCode) {
            this.countryCode = countryCode;
        }

        public String getStateCode() {
            return stateCode;
        }

        public void setStateCode(String stateCode) {
            this.stateCode = stateCode;
        }

        public String getDestinationCode() {
            return destinationCode;
        }

        public void setDestinationCode(String destinationCode) {
            this.destinationCode = destinationCode;
        }

        public int getZoneCode() {
            return zoneCode;
        }

        public void setZoneCode(int zoneCode) {
            this.zoneCode = zoneCode;
        }

        public Coordinates getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(Coordinates coordinates) {
            this.coordinates = coordinates;
        }

        public String getCategoryCode() {
            return categoryCode;
        }

        public void setCategoryCode(String categoryCode) {
            this.categoryCode = categoryCode;
        }

        public String getCategoryGroupCode() {
            return categoryGroupCode;
        }

        public void setCategoryGroupCode(String categoryGroupCode) {
            this.categoryGroupCode = categoryGroupCode;
        }

        public String getChainCode() {
            return chainCode;
        }

        public void setChainCode(String chainCode) {
            this.chainCode = chainCode;
        }

        public String getAccommodationTypeCode() {
            return accommodationTypeCode;
        }

        public void setAccommodationTypeCode(String accommodationTypeCode) {
            this.accommodationTypeCode = accommodationTypeCode;
        }

        public List<String> getBoardCodes() {
            return boardCodes;
        }

        public void setBoardCodes(List<String> boardCodes) {
            this.boardCodes = boardCodes;
        }

        public List<String> getSegmentCodes() {
            return segmentCodes;
        }

        public void setSegmentCodes(List<String> segmentCodes) {
            this.segmentCodes = segmentCodes;
        }

        public Address getAddress() {
            return address;
        }

        public void setAddress(Address address) {
            this.address = address;
        }

        public String getPostalCode() {
            return postalCode;
        }

        public void setPostalCode(String postalCode) {
            this.postalCode = postalCode;
        }

        public City getCity() {
            return city;
        }

        public void setCity(City city) {
            this.city = city;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public List<Phone> getPhones() {
            return phones;
        }

        public void setPhones(List<Phone> phones) {
            this.phones = phones;
        }

        public List<Room> getRooms() {
            return rooms;
        }

        public void setRooms(List<Room> rooms) {
            this.rooms = rooms;
        }

        public List<Wildcard> getWildcards() {
            return wildcards;
        }

        public void setWildcards(List<Wildcard> wildcards) {
            this.wildcards = wildcards;
        }

        public String getLastUpdate() {
            return lastUpdate;
        }

        public void setLastUpdate(String lastUpdate) {
            this.lastUpdate = lastUpdate;
        }

        public int getRanking() {
            return ranking;
        }

        public void setRanking(int ranking) {
            this.ranking = ranking;
        }
    }

    public static class Name {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

    public static class Description {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

    public static class Coordinates {
        private double longitude;
        private double latitude;

        public double getLongitude() {
            return longitude;
        }

        public void setLongitude(double longitude) {
            this.longitude = longitude;
        }

        public double getLatitude() {
            return latitude;
        }

        public void setLatitude(double latitude) {
            this.latitude = latitude;
        }
    }

    public static class Address {
        private String content;
        private String street;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getStreet() {
            return street;
        }

        public void setStreet(String street) {
            this.street = street;
        }
    }

    public static class City {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

    public static class Phone {
        @JsonProperty("phoneNumber")
        private String phoneNumber;
        
        @JsonProperty("phoneType")
        private String phoneType;

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getPhoneType() {
            return phoneType;
        }

        public void setPhoneType(String phoneType) {
            this.phoneType = phoneType;
        }
    }

    public static class Room {
        @JsonProperty("roomCode")
        private String roomCode;
        
        @JsonProperty("isParentRoom")
        private boolean isParentRoom;
        
        @JsonProperty("minPax")
        private int minPax;
        
        @JsonProperty("maxPax")
        private int maxPax;
        
        @JsonProperty("maxAdults")
        private int maxAdults;
        
        @JsonProperty("maxChildren")
        private int maxChildren;
        
        @JsonProperty("minAdults")
        private int minAdults;
        
        @JsonProperty("roomType")
        private String roomType;
        
        @JsonProperty("characteristicCode")
        private String characteristicCode;
        
        @JsonProperty("roomFacilities")
        private List<RoomFacility> roomFacilities;
        
        @JsonProperty("roomStays")
        private List<RoomStay> roomStays;
        
        @JsonProperty("PMSRoomCode")
        private String pmsRoomCode;

        public String getRoomCode() {
            return roomCode;
        }

        public void setRoomCode(String roomCode) {
            this.roomCode = roomCode;
        }

        public boolean isParentRoom() {
            return isParentRoom;
        }

        public void setParentRoom(boolean parentRoom) {
            isParentRoom = parentRoom;
        }

        public int getMinPax() {
            return minPax;
        }

        public void setMinPax(int minPax) {
            this.minPax = minPax;
        }

        public int getMaxPax() {
            return maxPax;
        }

        public void setMaxPax(int maxPax) {
            this.maxPax = maxPax;
        }

        public int getMaxAdults() {
            return maxAdults;
        }

        public void setMaxAdults(int maxAdults) {
            this.maxAdults = maxAdults;
        }

        public int getMaxChildren() {
            return maxChildren;
        }

        public void setMaxChildren(int maxChildren) {
            this.maxChildren = maxChildren;
        }

        public int getMinAdults() {
            return minAdults;
        }

        public void setMinAdults(int minAdults) {
            this.minAdults = minAdults;
        }

        public String getRoomType() {
            return roomType;
        }

        public void setRoomType(String roomType) {
            this.roomType = roomType;
        }

        public String getCharacteristicCode() {
            return characteristicCode;
        }

        public void setCharacteristicCode(String characteristicCode) {
            this.characteristicCode = characteristicCode;
        }

        public List<RoomFacility> getRoomFacilities() {
            return roomFacilities;
        }

        public void setRoomFacilities(List<RoomFacility> roomFacilities) {
            this.roomFacilities = roomFacilities;
        }

        public List<RoomStay> getRoomStays() {
            return roomStays;
        }

        public void setRoomStays(List<RoomStay> roomStays) {
            this.roomStays = roomStays;
        }

        public String getPmsRoomCode() {
            return pmsRoomCode;
        }

        public void setPmsRoomCode(String pmsRoomCode) {
            this.pmsRoomCode = pmsRoomCode;
        }
    }

    public static class RoomFacility {
        @JsonProperty("facilityCode")
        private int facilityCode;
        
        @JsonProperty("facilityGroupCode")
        private int facilityGroupCode;
        private int number;
        
        @JsonProperty("indYesOrNo")
        private boolean indYesOrNo;
        private boolean voucher;

        public int getFacilityCode() {
            return facilityCode;
        }

        public void setFacilityCode(int facilityCode) {
            this.facilityCode = facilityCode;
        }

        public int getFacilityGroupCode() {
            return facilityGroupCode;
        }

        public void setFacilityGroupCode(int facilityGroupCode) {
            this.facilityGroupCode = facilityGroupCode;
        }

        public int getNumber() {
            return number;
        }

        public void setNumber(int number) {
            this.number = number;
        }

        public boolean isIndYesOrNo() {
            return indYesOrNo;
        }

        public void setIndYesOrNo(boolean indYesOrNo) {
            this.indYesOrNo = indYesOrNo;
        }

        public boolean isVoucher() {
            return voucher;
        }

        public void setVoucher(boolean voucher) {
            this.voucher = voucher;
        }
    }

    public static class RoomStay {
        @JsonProperty("stayType")
        private String stayType;
        private String order;
        private String description;
        
        @JsonProperty("roomStayFacilities")
        private List<RoomStayFacility> roomStayFacilities;

        public String getStayType() {
            return stayType;
        }

        public void setStayType(String stayType) {
            this.stayType = stayType;
        }

        public String getOrder() {
            return order;
        }

        public void setOrder(String order) {
            this.order = order;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<RoomStayFacility> getRoomStayFacilities() {
            return roomStayFacilities;
        }

        public void setRoomStayFacilities(List<RoomStayFacility> roomStayFacilities) {
            this.roomStayFacilities = roomStayFacilities;
        }
    }

    public static class RoomStayFacility {
        @JsonProperty("facilityCode")
        private int facilityCode;
        
        @JsonProperty("facilityGroupCode")
        private int facilityGroupCode;
        private int number;

        public int getFacilityCode() {
            return facilityCode;
        }

        public void setFacilityCode(int facilityCode) {
            this.facilityCode = facilityCode;
        }

        public int getFacilityGroupCode() {
            return facilityGroupCode;
        }

        public void setFacilityGroupCode(int facilityGroupCode) {
            this.facilityGroupCode = facilityGroupCode;
        }

        public int getNumber() {
            return number;
        }

        public void setNumber(int number) {
            this.number = number;
        }
    }

    public static class Wildcard {
        @JsonProperty("roomType")
        private String roomType;
        
        @JsonProperty("roomCode")
        private String roomCode;
        
        @JsonProperty("characteristicCode")
        private String characteristicCode;
        
        @JsonProperty("hotelRoomDescription")
        private HotelRoomDescription hotelRoomDescription;

        public String getRoomType() {
            return roomType;
        }

        public void setRoomType(String roomType) {
            this.roomType = roomType;
        }

        public String getRoomCode() {
            return roomCode;
        }

        public void setRoomCode(String roomCode) {
            this.roomCode = roomCode;
        }

        public String getCharacteristicCode() {
            return characteristicCode;
        }

        public void setCharacteristicCode(String characteristicCode) {
            this.characteristicCode = characteristicCode;
        }

        public HotelRoomDescription getHotelRoomDescription() {
            return hotelRoomDescription;
        }

        public void setHotelRoomDescription(HotelRoomDescription hotelRoomDescription) {
            this.hotelRoomDescription = hotelRoomDescription;
        }
    }

    public static class HotelRoomDescription {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}

class AuditData {
    public String environment;
    public String processTime;
    public String release;
    public String requestHost;
    public String serverId;
    public String timestamp;
}



class AccommodationType {
    public String code;
    public String typeDescription;
    public TypeMultiDescription typeMultiDescription;
}

class TypeMultiDescription {
    public String content;
    public String languageCode;
}



class Board {
    public String code;
    public HotelDescription description;
    public String multiLingualCode;
}

class Category {
    public String accommodationType;
    public String code;
    public HotelDescription description;
    public String group;
    public int simpleCode;
}



class CategoryGroup {
    public String code;
    public HotelDescription description;
    public HotelName name;
    public int order;
}

class Chain {
    public int code;
    public HotelDescription description;
}


class Coordinates {
    public double latitude;
    public double longitude;
}

class Country {
    public String code;
    public HotelDescription description;
    public String isoCode;
    public List<State> states;
}

class State {
    public String code;
    public String name;
}

class Destination {
    public String code;
    public String countryCode;
    public List<GroupZone> groupZones;
    public String isoCode;
    public HotelName name;
    public List<Zone> zones;
}

class GroupZone {
    public String groupZoneCode;
    public HotelName name;
    public List<Integer> zones;
}

class Facility {
    public int ageFrom;
    public int ageTo;
    public int amount;
    public String applicationType;
    public String currency;
    public String dateFrom;
    public String dateTo;
    public HotelDescription description;
    public int distance;
    public int facilityCode;
    public int facilityGroupCode;
    public String facilityName;
    public boolean indFee;
    public boolean indLogic;
    public boolean indYesOrNo;
    public int number;
    public int order;
    public String timeFrom;
    public String timeTo;
    public boolean voucher;
}

class Image {
    public String characteristicCode;
    public String imageTypeCode;
    public int order;
    public String path;
    public String roomCode;
    public String roomType;
    public Type type;
    public int visualOrder;
    public String PMSRoomCode;
}

class Type {
    public String code;
    public HotelDescription description;
}

class InterestPoint {
    public int distance;
    public int facilityCode;
    public int facilityGroupCode;
    public boolean fee;
    public int order;
    public String poiName;
}

class Issue {
    public boolean alternative;
    public String dateFrom;
    public String dateTo;
    public HotelDescription description;
    public String issueCode;
    public String issueType;
    public int order;
}





class RoomFacility {
    public HotelDescription description;
    public int facilityCode;
    public int facilityGroupCode;
    public boolean indFee;
    public boolean indLogic;
    public boolean indYesOrNo;
    public int number;
    public int order;
    public boolean voucher;
}

class RoomStay {
    public String description;
    public int order;
    public List<RoomStayFacility> roomStayFacilities;
    public String stayType;
}

class RoomStayFacility {
    public HotelDescription description;
    public int facilityCode;
    public int facilityGroupCode;
    public int number;
}

class Segment {
    public int code;
    public HotelDescription description;
}

class Terminal {
    public HotelDescription description;
    public int distance;
    public HotelName name;
    public String terminalCode;
    public String terminalType;
}





class Zone {
    public HotelDescription description;
    public String name;
    public int zoneCode;
}


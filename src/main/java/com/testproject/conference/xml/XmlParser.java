package com.testproject.conference.xml;

import java.util.Map;
import java.util.Set;

import com.testproject.conference.data.*;

/* Handles all requests to .xml data file */

public interface XmlParser {

	public void initCollections(Map<String, Client> clientsMap, 
			Set<Reservation> reservationsSet,
			Set<Integer> sequencesSet);
	
	public void storeClient(Client client);
	
	public void storeReservation(Reservation reservation);
}

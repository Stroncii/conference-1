package com.testproject.conference.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.testproject.conference.data.*;
import com.testproject.conference.xml.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


public class ActionManagerImpl implements ActionManager {

	private Map<String, Client> clientsMap = new HashMap<String, Client>();
	private Set<Reservation> reservationsSet = new HashSet<Reservation>();
	private Set<Integer> sequencesSet = new HashSet<Integer>();
	
	private XmlParser xmlParser = new XmlParserImpl();
	
	/*public ActionManagerImpl() {
		
		xmlParser.initCollections(clientsMap, reservationsList, sequencesList);
	}*/
	
	public void sendBase(HttpServletResponse response) {
		
		xmlParser.initCollections(clientsMap, reservationsSet, sequencesSet);
		
		PrintWriter writer;
		
		try {
			writer = response.getWriter();
		} catch (IOException e) {
			e.printStackTrace();
			return;
		}
		//send header
		writer.println("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
		writer.println("<base>");
		//send data
		writer.println("<reservations>");
		for (Reservation reservation : reservationsSet) {
			writer.println("<reservation>");
			writer.println("<client>" + reservation.getResponsibleClient().getName() + "</client>");
			writer.println("<startdatetime>" + reservation.getStartDateTime().getTime() + "</startdatetime>");
			writer.println("<enddatetime>" + reservation.getEndDateTime().getTime() + "</enddatetime>");
			writer.println("</reservation>");
		}
		writer.println("</reservations>");
		writer.println("</base>");
		writer.close();
	}

	@SuppressWarnings("deprecation")
	public void addToBase(HttpServletRequest request, HttpServletResponse response) {
		
		int period = Integer.parseInt(request.getParameter("period"));
		int reservationsNumber = Integer.parseInt(request.getParameter("reservationsnumber"));
		
		String clientName =  request.getParameter("name");
		String password = request.getParameter("password");
		
		Date startDateTime = new Date();
		startDateTime.setTime(Long.parseLong(request.getParameter("startdatetime")));
		
		Date endDateTime = new Date();
		endDateTime.setTime(Long.parseLong(request.getParameter("enddatetime")));	
		
		Client client = clientsMap.get(clientName);
		if (client != null) {
			if (!client.getPassword().equals(password)) {
				sendResult(response, 2);
				return;
			}
		} else {
			client = new Client();
			client.setName(clientName);
			client.setPassword(password);
			clientsMap.put(clientName, client);
			
			xmlParser.storeClient(client);
		}
		
		for (int i = 0; i < reservationsNumber; i++) {
		
		/*	if (!checkReservationPossibility(startDateTime, endDateTime)) {
				sendResult(response, 1);
				return;
			}		
					
		Integer sequence = Integer.parseInt(request.getParameter("sequence"));
		sequencesSet.add(sequence);*/
		
			Reservation reservation = new Reservation();
			reservation.setResponsibleClient(client);
			reservation.setStartDateTime(startDateTime);
			reservation.setEndDateTime(endDateTime);
			reservation.setSequence(0);
			reservationsSet.add(reservation);
			
			xmlParser.storeReservation(reservation);
			
			startDateTime.setDate(startDateTime.getDate() + period);
			endDateTime.setDate(startDateTime.getDate() + period);
		}
		sendResult(response, 0);
	}

	
	private boolean checkReservationPossibility(Date start, Date end) {
		
		return true;
	}
	
	private void sendResult(HttpServletResponse response, int i) {
		
		PrintWriter writer;
		
		try {
			writer = response.getWriter();
		} catch (IOException e) {
			e.printStackTrace();
			return;
		}
		
		writer.println(i);
	}
}

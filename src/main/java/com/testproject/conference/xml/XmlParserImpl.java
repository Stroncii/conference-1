package com.testproject.conference.xml;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;
import org.xml.sax.SAXException;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.Set;

import com.testproject.conference.data.Client;
import com.testproject.conference.data.Reservation;
import com.testproject.conference.param.GlobalParameters;

public class XmlParserImpl implements XmlParser {
	
	@SuppressWarnings("deprecation")
	public void initCollections(Map<String, Client> clientsMap,
			Set<Reservation> reservationsSet,
			Set<Integer> sequencesSet) {
		
		clientsMap.clear();
		reservationsSet.clear();
		sequencesSet.clear();
			
		String filepath = GlobalParameters.absoluteFilepath;
		
		try {
			
			//open xml file
			File fXmlFile = new File(filepath);
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(fXmlFile);
		 
			doc.getDocumentElement().normalize();
		 
			//get clients
			NodeList nodeList = doc.getElementsByTagName("client");
		 
			for (int i = 0; i < nodeList.getLength(); i++) {
		 
				Node node = nodeList.item(i);
				if (node.getNodeType() == Node.ELEMENT_NODE) {
		 
					Element element = (Element) node;
					String name = element.getAttribute("name");
					
					Client client = new Client();
					client.setName(name);
					client.setPassword(element.getElementsByTagName("password").item(0).getTextContent());
					clientsMap.put(name, client);
				}
		    } 
			
			//get reservations and sequences
			nodeList = doc.getElementsByTagName("reservation");
			
			for (int i = 0; i < nodeList.getLength(); i++) {
				 
				Node node = nodeList.item(i);
				if (node.getNodeType() == Node.ELEMENT_NODE) {
		 
					Element element = (Element) node;
										
					Reservation reservation = new Reservation ();
					String responsibleClientName = element.getElementsByTagName("clientname").item(0).getTextContent(); 
					reservation.setResponsibleClient(clientsMap.get(responsibleClientName));
					
					Date startDateTime = new Date();
					startDateTime.setTime(Long.parseLong(element.getElementsByTagName("startdatetime").item(0).getTextContent()));
					
					Date endDateTime = new Date();
					endDateTime.setTime(Long.parseLong(element.getElementsByTagName("enddatetime").item(0).getTextContent()));
					
					reservation.setStartDateTime(startDateTime);					
					reservation.setEndDateTime(endDateTime);
					
					int sequence;
					try {
						sequence = Integer.parseInt(
							element.getElementsByTagName("sequence").item(0).getTextContent());
					}
					catch (Exception e) {
						sequence = 0;
					}		
	
					reservation.setSequence(sequence);
					
					reservationsSet.add(reservation);
					sequencesSet.add(sequence);
				}
		    } 
			
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
	
	
	public void storeClient(Client client) {
		
		String filepath = GlobalParameters.absoluteFilepath;
		
		try {
			
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
			Document doc = docBuilder.parse(filepath);
	  
			Element clientElement = doc.createElement("client");
			
			clientElement.setAttribute("name", client.getName());
			
			Node passwordNode = doc.createElement("password");
			passwordNode.appendChild(doc.createTextNode(client.getPassword()));
			clientElement.appendChild(passwordNode);
			
			
			Node clients = doc.getElementsByTagName("clients").item(0);
			clients.appendChild(clientElement);
	  
			// write the content into xml file
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(new File(filepath));
			transformer.transform(source, result);
	 
			System.out.println("Done");
	 
		} catch (ParserConfigurationException pce) {
			pce.printStackTrace();
		} catch (TransformerException tfe) {
			tfe.printStackTrace();
		} catch (IOException ioe) {
			ioe.printStackTrace();
		} catch (SAXException sae) {
			sae.printStackTrace();
		}
	}
	
	
	public void storeReservation(Reservation reservation) {
		
		String filepath = GlobalParameters.absoluteFilepath;
		
		try {
			
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
			Document doc = docBuilder.parse(filepath);
	  
			Element reservationElement = doc.createElement("reservation");
			
			Node nameNode = doc.createElement("clientname");
			nameNode.appendChild(doc.createTextNode(reservation.getResponsibleClient().getName()));
			reservationElement.appendChild(nameNode);
			
			Node startDateTimeNode = doc.createElement("startdatetime");
			startDateTimeNode.appendChild(doc.createTextNode("" + reservation.getStartDateTime().getTime()));
			reservationElement.appendChild(startDateTimeNode);
			
			Node endDateTimeNode = doc.createElement("enddatetime");
			endDateTimeNode.appendChild(doc.createTextNode("" + reservation.getEndDateTime().getTime()));
			reservationElement.appendChild(endDateTimeNode);
			
			if (reservation.getSequence() != 0) {
				Node sequenceNode = doc.createElement("sequence");
				sequenceNode.appendChild(doc.createTextNode("" + reservation.getSequence()));
				reservationElement.appendChild(sequenceNode);
			}
			
			Node reservations = doc.getElementsByTagName("reservations").item(0);
			reservations.appendChild(reservationElement);
	  
			// write the content into xml file
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(new File(filepath));
			transformer.transform(source, result);
	 
			System.out.println("Done");
	 
		} catch (ParserConfigurationException pce) {
			pce.printStackTrace();
		} catch (TransformerException tfe) {
			tfe.printStackTrace();
		} catch (IOException ioe) {
			ioe.printStackTrace();
		} catch (SAXException sae) {
			sae.printStackTrace();
		}
	}
}

from kivy.garden.mapview import MapView, MapMarker
from kivy.uix.widget import Widget
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.slider import Slider
from kivy.properties import NumericProperty, ObjectProperty, StringProperty
from kivy.uix.textinput import TextInput
from plyer import gps
from kivy.logger import Logger
from kivy.app import App

import json

from plyer import email

#from fakegps import FakeGPS

def strlist(mylist):
    return ' '.join(str(x) for x in mylist)

class MainMap(Widget):
    mapview = ObjectProperty(None)
    mapsource = ObjectProperty(None)
    latitude = NumericProperty(0)
    longitude = NumericProperty(0)
    zoom = NumericProperty(0)

    nodesnum = NumericProperty(0)
    nodename = StringProperty("")

    slider = ObjectProperty(None)
    textinput = ObjectProperty(None)

    locater = gps
    #locater = FakeGPS()

    map_loaded = False
    nodes = []
    lastnode = None

    def update(self, **kwargs):
        self.latitude = kwargs['lat']
        self.longitude = kwargs['lon']

        if self.map_loaded == False:
            self.mapview.center_on(self.latitude, self.longitude)
            self.map_loaded = True

    def drop(self):
        self.nodes.append({ "id": self.nodesnum, "name": self.textinput.text, "lat": self.latitude, "lon": self.longitude, "numnodes": 0, "nodes": [] })
        if self.nodesnum > 0:
            self.nodes[self.nodesnum]["numnodes"] = 1
            self.nodes[self.nodesnum]["nodes"].append(int(self.slider.value))
            self.nodes[int(self.slider.value)]["nodes"].append(self.nodesnum)
            self.nodes[int(self.slider.value)]["numnodes"] += 1

        self.mapview.add_marker(MapMarker(lon=self.longitude, lat=self.latitude))

        #Logger.info("Application: \nNode added {\n" + "id: " + str(self.nodes[self.nodesnum]["id"]) + "\nname: " + self.nodes[self.nodesnum]["name"] +
        #            "\nlatitude: " + str(self.nodes[self.nodesnum]["lat"]) + "\nlongitude: " + str(self.nodes[self.nodesnum]["lon"]) +
        #            "\nnumnodes: " + str(self.nodes[self.nodesnum]["numnodes"]) + "\nnodes: " + strlist(self.nodes[self.nodesnum]["nodes"]))

        self.lastnode = self.nodesnum

        self.slider.value = self.nodesnum

        self.nodesnum += 1

    def save(self):
        output = "["
        for node in self.nodes:
            output += json.dumps(node)
            if node["id"] < self.nodesnum - 1:
                output += ", "
        output += "]"

        #Logger.info("Application: " + output)

        email.send(recipient="rwilliams17@lawrenceville.org", text=output)

class MainApp(App):
    def build(self):
        widg = MainMap()
        widg.locater.configure(on_location=widg.update)
        widg.locater.start()
        return widg

if __name__ == '__main__':
	MainApp().run()

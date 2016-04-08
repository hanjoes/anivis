#!/usr/bin/python2.7
# coding: utf-8

import json, xmltodict
from xml.etree import ElementTree as ET

'''
    info
    {
        "name"      : <_name>
        "genres"    : [<action, romance, adventure, shonen>]
        "themes"    : [<war, developing powers, fighting, pirates>]
    }

    anime_info
    {
        "movies" : [info_1, info_2, ...]
        "manga"  : [info_1, info_2, ...]
        "anime"  : [info_1, info_2, ...]
        ...
    }


'''


class Transform:
    UNKNOWN = "NA"

    TAG_ANN = "ann"
    TAG_ANIME = "anime"
    TAG_INFO = "info"
    TAG_MANGA = "manga"

    TAG_ATTR_NAME = "name"
    TAG_ATTR_TYPE = "type"
    TAG_VALUE = "value"  # data contained with in the tag
    TAG_ATTR_TYPE_GENRES = "Genres"
    TAG_ATTR_TYPE_THEMES = "Themes"

    MOVIES = "movies"
    MANGA = "manga"
    ANIME = "anime"
    ATTR_NAME = "name"

    ATTR_GENRE = TAG_ATTR_TYPE_GENRES
    ATTR_THEMES = TAG_ATTR_TYPE_THEMES

    info_tag_type_values = [TAG_ATTR_TYPE_GENRES, TAG_ATTR_TYPE_THEMES]

    def __init__(self):
        pass

    # converts the given xml file to json string
    def xml_to_json(self, file_name):
        anime_infos = {}
        print file_name
        xml = ET.parse(file_name)
        root_element = xml.getroot()
        for children in root_element.findall(self.TAG_ANN):  # <ann>
            for anime in children:  # <anime> or <manga>
                if self.tag_attrib_value(anime, self.TAG_ATTR_NAME) != self.UNKNOWN:
                    anime_type, info = self.init_info(anime, anime_infos)
                    self.handle_tag(anime, info)
                    print anime_type + " " + str(info)
                    anime_infos[anime_type].append(info)
        return anime_infos

    # create a new anime info ()
    def init_info(self, anime, anime_infos):
        name = self.tag_attrib_value(anime, self.TAG_ATTR_NAME)
        info = self.default_info(name)
        anime_type = self.tag_attrib_value(anime, self.TAG_ATTR_TYPE)

        # create new type of for the info e.g manga, anime, movies OVA ...
        if anime_type not in anime_infos:
            anime_infos[anime_type] = []
        return anime_type, info

    # get given attrib value for the given tag
    def tag_attrib_value(self, tag_node, attib_name):
        if attib_name in tag_node.attrib:
            return tag_node.attrib[attib_name]
        return self.UNKNOWN

    # create handle method for each tag you want to process
    def handle_tag(self, tag_node, anime_info):
        self.handle_info_tags(tag_node, anime_info)

    # handler for different information that are to be in the <info> tag
    def handle_info_tags(self, root, anime_info):
        for info in root.findall(self.TAG_INFO):
            if self.TAG_ATTR_TYPE not in info.attrib:
                continue
            type_info = self.handle_info_tag_types(info)
            if type_info:
                anime_info[type_info[self.TAG_ATTR_TYPE]].append(type_info[self.TAG_VALUE])

    # handles "type" attrib in the <info> tag which have value in "info_type"
    def handle_info_tag_types(self, tag_node):
        if tag_node.attrib[self.TAG_ATTR_TYPE] in self.info_tag_type_values:
            return {self.TAG_ATTR_TYPE: tag_node.attrib[self.TAG_ATTR_TYPE], self.TAG_VALUE: tag_node.text}

    def default_info(self, name):
        return {self.ATTR_NAME: name, self.ATTR_GENRE: [], self.ATTR_THEMES: []}

    def parse_all_files(self, xml_dir, des_folder, is_per_file):
        import os
        all_data = []
        for fn in os.listdir(xml_dir):
            src_file = xml_dir + "/" + fn
            if os.path.isfile(src_file):
                data = self.xml_to_json(src_file)
                if (is_per_file):
                    file_name = str(fn.split(".")[0]) + ".json"
                    des_file = des_folder + "/" + file_name
                    with open(des_file, "w+") as jsonfile:
                        jsonfile.write(json.dumps(data))
                else:
                    all_data.append(data)

        if not is_per_file:
            result = {}

            for data in all_data:
                for key, value in data.iteritems():
                    if key not in result:
                        result[key] = value
                    else:
                        result[key] = result[key] + value

            file_name = "anime.json"
            des_file = des_folder + "/" + file_name
            with open(des_file, "w+") as jsonfile:
                jsonfile.write(json.dumps(result))


if __name__ == "__main__":
    transform = Transform()
    # print transform.xml_to_json("animes.xml")

    xml_dir = "anime_xmls"
    des_dir = "anime_json"

    transform.parse_all_files(xml_dir, des_dir, False)

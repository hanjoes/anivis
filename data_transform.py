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

    NAME = "name"
    IS_ROOT = "isRoot"
    CHILDREN = "children"
    IS_LEAF = "isLeaf"
    TRUE = "yes"
    FALSE = "no"
    UNKNOWN_THEME = "No Theme"
    UNKNOWN_GENRE = "No Genre"
    ALL = "all"

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

            self.intermediate_transform_v2(result)

            file_name = "anime.json"
            des_file = des_folder + "/" + file_name
            with open(des_file, "w+") as jsonfile:
                jsonfile.write(json.dumps(result))

    """

    {
     "name": "Animes",
     "isRoot": "yes",
     "children": [
          {
            "name": "TV",
            "children": [
              {
                "name": "Themes",
                "children": [
                  {
                    "name": "fighting",
                    "children": [
                      {
                        "name": "Mobile Fighter G Gundam",
                        "leaf": "yes"
                      },
                      { "name": "Movie 2", "leaf": "yes", "animeId": 32 },
                      { "name": "Movie 3", "leaf": "yes", "animeId": 2 },
                      { "name": "Movie 2", "leaf": "yes", "animeId": 32 }
                    ]
                  },
                  {
                    "name": "martial arts",
                    "children": [
                      { "name": "martial arts 1", "leaf": "yes", "animeId": 90},
                      { "name": "martial arts 2", "leaf": "yes", "animeId": 1},
                      { "name": "martial arts 3", "leaf": "yes", "animeId": 23}
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "Magazine",
            "children": [
              {
                "name": "Themes",
                "children": [
                  {
                    "name": "fighting",
                    "children": [
                      {
                        "name": "Mobile Fighter G Gundam",
                        "leaf": "yes"
                      },
                      { "name": "Movie 2", "leaf": "yes", "animeId": 32 },
                      { "name": "Movie 3", "leaf": "yes", "animeId": 2 },
                      { "name": "Movie 2", "leaf": "yes", "animeId": 32 }
                    ]
                  },
                  {
                    "name": "martial arts",
                    "children": [
                      { "name": "martial arts 1", "leaf": "yes", "animeId": 90},
                      { "name": "martial arts 2", "leaf": "yes", "animeId": 1},
                      { "name": "martial arts 3", "leaf": "yes", "animeId": 23}
                    ]
                  }
                ]
              }
            ]
          }
         ]
    }

    """

    def gen_default_node(self, name, _type, _children):
        return {self.NAME: name, _type: "yes", self.CHILDREN: _children}

    def gen_zoom_node(self):
        return {}

    def gen_leaf_node(self, name, _type):
        return {self.NAME: name, _type: "yes"}

    def gen_default_leaf(self, name):
        return {self.NAME: name, self.IS_ROOT: self.FALSE, self.IS_LEAF: self.TRUE}

    def intermediate_transform(self, json_data):
        inter_data = {}
        for data in json_data:
            type = data  # TV, OVA, MOVIE , MANGA ,MAGAZINE...
            if type not in inter_data:
                inter_data[type] = {}
            for anime in json_data[data]:
                anime_name = anime[self.ATTR_NAME]

                # process all different themes
                if self.ATTR_THEMES not in inter_data[type]:
                    inter_data[type][self.ATTR_THEMES] = {}
                if len(anime[self.ATTR_THEMES]) == 0:
                    if self.UNKNOWN_THEME not in inter_data[type][self.ATTR_THEMES]:
                        inter_data[type][self.ATTR_THEMES][self.UNKNOWN_THEME] = {}
                    inter_data[type][self.ATTR_THEMES][self.UNKNOWN_THEME][anime_name] = self.gen_default_leaf(
                        anime_name)

                else:
                    for theme in anime[self.ATTR_THEMES]:
                        theme = theme.replace("/", "")
                        if theme not in inter_data[type][self.ATTR_THEMES]:
                            inter_data[type][self.ATTR_THEMES][theme] = {}
                        inter_data[type][self.ATTR_THEMES][theme][anime_name] = self.gen_default_leaf(anime_name)

                # process all different genre
                if self.ATTR_GENRE not in inter_data[type]:
                    inter_data[type][self.ATTR_GENRE] = {}

                if len(anime[self.ATTR_GENRE]) == 0:
                    if self.UNKNOWN_GENRE not in inter_data[type][self.ATTR_GENRE]:
                        inter_data[type][self.ATTR_GENRE][self.UNKNOWN_GENRE] = {}
                    inter_data[type][self.ATTR_GENRE][self.UNKNOWN_GENRE][anime_name] = self.gen_default_leaf(
                        anime_name)
                else:
                    for genre in anime[self.ATTR_GENRE]:
                        genre = genre.replace("/", "")
                        if genre not in inter_data[type][self.ATTR_GENRE]:
                            inter_data[type][self.ATTR_GENRE][genre] = {}
                        inter_data[type][self.ATTR_GENRE][genre][anime_name] = self.gen_default_leaf(anime_name)
        self.gen_zoomed_in_view_data(inter_data)

    def gen_zoomed_in_view_data(self, intermediate_data):
        import re
        root = "web"
        manga_type = ["manga", "magazine"]
        for type in intermediate_data:
            path = "db/anime/"
            if type in manga_type:
                path = "db/manga/"
            path += str(re.escape(type))
            for categories in intermediate_data[type]:
                dir_path = path + "/" + str(re.escape(categories))
                self.create_dir(dir_path)
                for data in intermediate_data[type][categories]:
                    des_file = dir_path + "/" + re.escape(data) + ".json"
                    with open(des_file, "w+") as jsonfile:
                        jsonfile.write(json.dumps(intermediate_data[type][categories][data]))

    def intermediate_transform_v2(self, json_data):
        inter_data = {}
        for data in json_data:
            type = data  # TV, OVA, MOVIE , MANGA ,MAGAZINE...
            if type not in inter_data:
                inter_data[type] = {}
                inter_data[type][self.ALL] = {}
            for anime in json_data[data]:
                genres = [self.UNKNOWN_GENRE]
                themes = [self.UNKNOWN_THEME]
                anime_name = anime[self.ATTR_NAME]
                # add the anime to ALL in the type hierarchy
                inter_data[type][self.ALL][anime_name] = self.gen_zoom_node()
                if len(anime[self.ATTR_GENRE]) > 0:
                    genres = anime[self.ATTR_GENRE]
                if len(anime[self.ATTR_THEMES]) > 0:
                    themes = anime[self.ATTR_THEMES]
                for genre in genres:
                    if genre not in inter_data[type]:
                        inter_data[type][genre] = {}
                        inter_data[type][genre][self.ALL] = {}
                    # add the anime to ALL in the genre hierarchy
                    inter_data[type][genre][self.ALL][anime_name] = self.gen_zoom_node()
                    for theme in themes:
                        if theme not in inter_data[type][genre]:
                            inter_data[type][genre][theme] = {}
                        inter_data[type][genre][theme][anime_name] = self.gen_zoom_node()
        self.gen_zoomed_view_v2(inter_data)

    def gen_zoomed_view_v2(self, intermediate_data_v2):
        manga_type = ["manga", "magazine"]
        root = "web/db"
        anime_media = {}
        manga_media = {}
        anime_all_genre = {}
        manga_all_genre = {}
        anime_all_theme = {}
        manga_all_theme = {}
        for type in intermediate_data_v2:
            category = "anime"
            if type in manga_type:
                category = "manga"
            if category == "anime":
                anime_media[type] = {}
            else:
                manga_media[type] = {}

            for genre in intermediate_data_v2[type]:
                if category == "anime":
                    anime_all_genre[genre] = {}
                else:
                    manga_all_genre[genre] = {}
                if genre == "all":
                    path = root + "/" + category + "/" + type + "/"
                    self.create_anime_json(category, genre, intermediate_data_v2[type][genre].keys(), path,
                                           theme, type)
                else:
                    for theme in intermediate_data_v2[type][genre]:
                        if category == "anime":
                            anime_all_theme[theme] = {}
                        else:
                            manga_all_theme[theme] = {}

                        path = root + "/" + category + "/" + type + "/" + genre.replace("/", "") + "/" + theme.replace(
                            "/",
                            "")
                        if theme == "all":
                            path = root + "/" + category + "/" + type + "/" + genre.replace("/", "")
                        self.create_anime_json(category, genre, intermediate_data_v2[type][genre][theme].keys(), path,
                                               theme, type)
        #for anime data
        path = root + "/" + "anime"
        self.create_file(path + "/media.json", anime_media)
        self.create_file(path + "/theme.json", anime_all_theme)
        self.create_file(path + "/genre.json", anime_all_genre)

        #for Manga data
        path = root + "/" + "manga"
        self.create_file(path + "/media.json", manga_media)
        self.create_file(path + "/theme.json", manga_all_theme)
        self.create_file(path + "/genre.json", manga_all_genre)

    def create_anime_json(self, category, genre, anime_list, path, theme, type):
        self.create_dir(path)
        des_file = path + "/" + "anime.json"
        leafs_json = []
        for key in anime_list:
            leafs_json.append(self.gen_leaf_node(key, "isMovie"))
        theme_json = self.gen_default_node(theme, "isTheme", leafs_json)
        genre_json = self.gen_default_node(genre, "isGenre", [theme_json])
        media_json = self.gen_default_node(type, "isMedia", [genre_json])
        root_json = self.gen_default_node(category, "isRoot", [media_json])
        self.create_file(des_file, root_json)

    def create_file(self, des_file, dict_data):
        with open(des_file, "w+") as jsonfile:
            # jsonfile.write(json.dumps(intermediate_data_v2[type][genre][theme]))
            jsonfile.write(json.dumps(dict_data))

    def gen_overview_forced_layout(self, intermediate_data):
        manga_type = ["manga", "magazine"]

    def create_dir(self, dir_name):
        import os
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)


if __name__ == "__main__":
    transform = Transform()
    # print transform.xml_to_json("animes.xml")

    xml_dir = "anime_xmls"
    des_dir = "anime_json"

    transform.parse_all_files(xml_dir, des_dir, False)

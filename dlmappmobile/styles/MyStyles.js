import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5
    },
    marginTop : {
        marginTop: 25,
    },
    marginBottom : {
        marginBottom: 25,
    },
    right: {
        marginLeft: 310
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8
    },
    column: {
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
     margin: {
        margin: 4,
     },
     middle: {
        marginLeft: 180
     },
     avatar: {
        width: 165,
        height: 95,
        borderRadius: 10,
     },
    padding: {
        padding: 10
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#055a8bff',
        padding: 10,
        borderRadius: 16,
        alignItems: 'center',  
        margin: 8,
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,            
        justifyContent: 'center', 
    },
    title: {
        color: 'black',
        fontSize: 20,
        fontWeight: '600',
        flexWrap: 'wrap',      
    },
    context: {
        color: '#fff',
        fontSize: 10,
        flexWrap: 'wrap',      
    },
    text: {
        color: 'black',
        flexWrap: 'wrap',      
        fontSize: 12
    },
    thumbnail: {
        borderRadius: 14,
        backgroundColor: '#eef1f4',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative'
    },
    portalContainer: {
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        borderRadius: 16
    },
    chatRow: {
        flexDirection: 'row',
        alignItems: 'center',  
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginRight: 12,
    },

    chatInfo: {
        flex:1,
        justifyContent: 'center'
    },

    chatName: {
        fontSize: 16,
        fontWeight: "600",
    }
})
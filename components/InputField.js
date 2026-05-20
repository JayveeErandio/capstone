import { TextInput, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function InputField({
  placeholder,
  password,
  numeric,
  maxLength,
  onChangeText,
  value,
}) {
  const [content, setContent] = useState("");

  const [showPass, setShowPass] = useState(false);

  const boxStyle = " border border-[#ccc] rounded-lg text-[#555] ";

  return password ? (
    <View className={"flex-row items-center px-3 py-3 gap-3" + boxStyle}>
      <TextInput
        onChangeText={(value) => {
          setContent(value);
          if (onChangeText) onChangeText(value);
        }}
        className="flex-1 px-0 py-0 font-archivo"
        inputMode={numeric && "numeric"}
        maxLength={maxLength}
        secureTextEntry={password ? !showPass : false}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        autoCapitalize="none"
      />
      <Pressable
        onPress={() => {
          if (content != "") setShowPass(!showPass);
        }}
        className={content == "" ? "opacity-0" : ""}
      >
        <Ionicons name={showPass ? "eye" : "eye-off"} size={18} color="#aaa" />
      </Pressable>
    </View>
  ) : (
    <TextInput
      onChangeText={setContent}
      className={boxStyle + "px-3 py-3 font-archivo"}
      inputMode={numeric && "numeric"}
      maxLength={maxLength}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      onChangeText={onChangeText}
      value={value}
    />
  );
}
